// @ts-check

const UpgradeStorage = require("./upgrade-storage");
const UpgradeServer = require("./upgrade-server");
const UpgradeDiscovery = require("./upgrade-discovery");
const AsyncService = require("./async-service");
const {
  getBestUpgradeCandidate,
  installerCompare,
  stringifyInstaller,
} = require("./utils");
const stream = require("stream");
const progressStream = require("progress-stream");
const log = require("debug")("p2p-upgrades:manager");

const getPort = require("get-port");
// How frequently to emit download progress events
const DOWNLOAD_PROGRESS_THROTTLE_MS = 400;

/** @typedef {import('./types').UpgradeState} UpgradeState */
/** @typedef {import('./types').UpgradeStateInternal} UpgradeStateInternal */
/** @typedef {import('./types').AsyncServiceState} AsyncServiceState */
/** @typedef {import('./types').InstallerExt} InstallerExt */
/** @typedef {import('./types').InstallerInt} InstallerInt */
/** @typedef {import('./types').TransferProgress} TransferProgress */
/** @typedef {import('./types').ManagerEvents} Events */

/**
 * Manage p2p upgrades. Start with `start()` and stop with `stop()`. It will
 * find an available port and start announcing the upgrades available locally
 * (including the currently running APK) and start downloading the most recent
 * installer available from discovered peers.
 *
 * It is an event emitter and will emit a "state" event whenever the state changes:
 *
 * ```ts
 * {
 *   // Current state of the UpgradeManager service. An "error" state is the
 *   // result of an unrecoverable error
 *   value: "stopped" | "starting" | "started" | "stopping" | "error",
 *   // Array of active uploads of installers to other peers
 *   uploads: {
 *     // Hash of installer being uploaded
 *     id: string,
 *     // Bytes uploaded so far
 *     sofar: number
 *     // Total bytes to transfer
 *     total: number
 *   },
 *   // Array of active uploads of installers to other peers
 *   downloads: {
 *     // Hash of installer being downloaded (Note: may not be correct - a peer
 *     // could fake this - we check it when download completes)
 *     id: string,
 *     // Bytes downloaded so far
 *     sofar: number
 *     // Total bytes to transfer
 *     total: number
 *   },
 *   // If an installer is downloaded and is more recent than the currently
 *   // running APK, then this value will be set to the info about that installer
 *   availableUpgrade?: {
 *     // See schema.js
 *   }
 * }
 * ```
 *
 * Will emit an "error" event if an upload or download fails. This is most
 * likely to happen because of network issues or because a peer goes offline
 *
 * @class UpgradeManager
 * @extends {AsyncService<Events>}
 */
class UpgradeManager extends AsyncService {
  // Used for logging
  #port = 0;
  #currentApkInfo;
  #deviceInfo;
  #storage;
  #discovery;
  #server;
  /** @type {UpgradeStateInternal} */
  #state = {
    downloads: [],
    uploads: [],
    checkedPeers: [],
    availableUpgrade: undefined,
  };
  /** @type {Map<string, { progress: TransferProgress, stream: import('stream').Readable, installerInfo: InstallerExt }>} */
  #downloads = new Map();
  /**
   * @param {object} options
   * @param {string} options.storageDir Path to folder to store installers
   * @param {InstallerInt} options.currentApkInfo info about the currently installed APK
   * @param {import('./types').DeviceInfo} options.deviceInfo Arch and SDK version of current device
   */
  constructor({ storageDir, currentApkInfo, deviceInfo }) {
    super();
    this.#currentApkInfo = currentApkInfo;
    this.#deviceInfo = deviceInfo;
    this.#storage = new UpgradeStorage({ storageDir, currentApkInfo });
    /** @private */
    this.#server = new UpgradeServer({ storage: this.#storage });
    /** @private */
    this.#discovery = new UpgradeDiscovery({
      discoveryKey: currentApkInfo.applicationId,
    });

    this.#server.on("uploads", uploads => {
      this.setState({ uploads });
    });
    this.#server.on("error", error => {
      this.emit("error", error);
    });
    this.#storage.on("error", error => {
      this.setState({ error });
    });
    this.#storage.on("installers", async installers => {
      this._onStoredInstallers(installers);
    });
    this.#discovery.on("installers", async installers => {
      this._onDownloadableInstallers(installers);
    });
    this.#discovery.on("checked", checkedPeers => {
      this.setState({ checkedPeers });
    });
    super.addStateListener(() => {
      this.emit("state", this.getState());
    });
  }

  /**
   * Return an instance of the Node HTTP server. Used for tests.
   */
  get httpServer() {
    return this.#server.httpServer;
  }

  /**
   * Called whenever the list of installers in local storage changes. If there
   * is an upgrade candidate in storage, then this will emit state with that
   * upgrade candidate
   *
   * @private
   * @param {InstallerInt[]} storedInstallers
   */
  _onStoredInstallers(storedInstallers) {
    log(
      `${this.#port}: Updated stored installers:`,
      storedInstallers.map(i => stringifyInstaller(i))
    );
    const upgradeCandidate = getBestUpgradeCandidate({
      deviceInfo: this.#deviceInfo,
      currentApkInfo: this.#currentApkInfo,
      installers: storedInstallers,
    });
    if (!upgradeCandidate) {
      log(`${this.#port}: No upgrade candidate in storage`);
      return;
    }
    log(
      `${this.#port}: Available upgrade:`,
      stringifyInstaller(upgradeCandidate)
    );
    this.setState({ availableUpgrade: upgradeCandidate });
  }

  /**
   * Called whenever the list of installers available to download from peers
   * changes. Attempts to download the latest version that is compatible with
   * the current device
   *
   * @private
   * @param {InstallerExt[]} downloadableInstallers
   */
  async _onDownloadableInstallers(downloadableInstallers) {
    try {
      const upgradeCandidate = getBestUpgradeCandidate({
        deviceInfo: this.#deviceInfo,
        currentApkInfo: this.#currentApkInfo,
        installers: downloadableInstallers,
      });
      // If none of the downloadable installers are an upgrade candidate, ignore
      if (!upgradeCandidate) return;
      log(
        `${this.#port}: Found available upgrade candidate`,
        stringifyInstaller(upgradeCandidate)
      );
      const { hash: candidateHash } = upgradeCandidate;
      const { availableUpgrade } = this.getState();
      // If we have an availableUpgrade in storage already, and this
      // upgradeCandidate a version less than or equal to the availableUpgrade,
      // ignore it
      if (
        availableUpgrade &&
        installerCompare.lte(upgradeCandidate, availableUpgrade)
      ) {
        log(
          `${this.#port}: Upgrade candidate ${candidateHash.slice(
            0,
            7
          )} is already downloaded`
        );
        return;
      }
      // If we are already in the process of downloading an installer with this
      // same hash, ignore this one
      if (this.#downloads.has(candidateHash)) {
        log(
          `${this.#port}: Upgrade candidate ${candidateHash.slice(
            0,
            7
          )} is downloading`
        );
        return;
      }
      // If we are already downloading an installer with a higher version number
      // than this one, ignore this one
      for (const { installerInfo } of this.#downloads.values()) {
        if (installerCompare.lte(upgradeCandidate, installerInfo)) {
          log(
            `${this.#port}: Already downloading ${stringifyInstaller(
              installerInfo
            )} which is newer than ${candidateHash.slice(0, 7)}`
          );
          return;
        }
      }
      const currentInstallers = await this.#storage.list();
      // If we this upgrade candidate is already in storage, we can ignore it
      if (
        currentInstallers.find(installer => installer.hash === candidateHash)
      ) {
        log(
          `${this.#port}: Upgrade candidate ${candidateHash.slice(
            0,
            7
          )} is already downloaded`
        );
        return;
      }
      // If there are any in progress downloads, cancel them
      for (const { stream, installerInfo } of this.#downloads.values()) {
        log(
          `${this.#port}: cancelling download of`,
          stringifyInstaller(installerInfo)
        );
        stream.destroy();
      }
      // Now we've cancelled the downloads, clear them from our map
      this.#downloads.clear();

      /** @type {TransferProgress} */
      const download = {
        id: candidateHash,
        sofar: 0,
        total: upgradeCandidate.size,
      };

      const rs = this.#discovery.createReadStream(candidateHash);
      const progress = progressStream(
        { length: upgradeCandidate.size, time: DOWNLOAD_PROGRESS_THROTTLE_MS },
        progress => {
          // Warning: we mutate the download object to avoid recreating an
          // object on every progress event, and also re-setting this.#downloads
          download.sofar = progress.transferred;
          this.emit("state", this.getState());
        }
      );
      const ws = this.#storage.createWriteStream({ hash: candidateHash });

      log(`${this.#port}: Start download:`, candidateHash.slice(0, 7));
      stream.pipeline(rs, progress, ws, e => {
        if (e)
          log(
            `${this.#port}: Error downloading ${candidateHash.slice(0, 7)}`,
            e
          );
        else
          log(`${this.#port}: Download complete ${candidateHash.slice(0, 7)}`);
        this.emit("state", this.getState());
        this.#downloads.delete(candidateHash);
        this.emit("state", this.getState());
      });

      this.#downloads.set(candidateHash, {
        stream: rs,
        progress: download,
        installerInfo: upgradeCandidate,
      });
      this.emit("state", this.getState());
    } catch (e) {
      log(`${this.#port}: Uncaught error processing available downloads`, e);
      this.setState({ error: e });
    }
  }

  /**
   * Get current state of UpgradeManager
   *
   * @returns {UpgradeState}
   */
  getState() {
    const mergedState = {
      ...super.getState(),
      ...this.#state,
      // Don't like this too much, but for now is better than duplicating
      // downloads on state
      downloads: Array.from(this.#downloads.values()).map(
        download => download.progress
      ),
    };
    if (this.#state.error) {
      mergedState.value = "error";
    }
    return mergedState;
  }

  /**
   * Set state of UpgradeManager, **merges with current state**. If you pass
   * state with value: "error" you _must_ also pass an error property
   *
   * @param {Partial<UpgradeStateInternal>} statePartial
   */
  setState(statePartial) {
    this.#state = { ...this.#state, ...statePartial };
    this.emit("state", this.getState());
  }

  /**
   * Start the downloader services.
   *
   * 1. Starts the server on an available port
   * 2. Starts the download discovery service
   * 3. Starts announcing on port
   *
   * @returns {Promise<void>} Resolves when started
   */
  async _start() {
    log(`${this.#port}: starting`);
    this.#port = await getPort();
    await Promise.all([
      this.#discovery.start(this.#port),
      this.#server.start(this.#port),
    ]);
    log(`${this.#port}: started`);
  }

  /**
   * Stop all the downloader services
   *
   * @returns {Promise<void>} Resolves when stopped
   */
  async _stop() {
    log(`${this.#port}: stopping`);
    await Promise.all([this.#discovery.stop(), this.#server.stop()]);
    log(`${this.#port}: stopped`);
  }
}

module.exports = UpgradeManager;
