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
const debug = require("debug");
const log = debug("p2p-upgrades:manager");

// Custom log formatter to print shortened hex hash using %h
debug.formatters.h = v => {
  return typeof v === "string" ? v.slice(0, 7) : v;
};
// Custom log formatter to print installer info as a single string using %i
debug.formatters.i = v => {
  return Array.isArray(v)
    ? v.map(v => stringifyInstaller(v)).join(", ")
    : stringifyInstaller(v);
};

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
  // Note: Not sure what the best practice is maintaining a replica of state
  // here: UpgradeServer keeps a list of active uploads, but whenever it updates
  // we copy that value into this class's state. A better solution might be to
  // call upgradeServer.list() as part of getState(), but that might be too
  // obscure for maintainers.
  /** @type {UpgradeStateInternal} */
  #state = {
    uploads: [],
    availableUpgrade: undefined,
  };
  /** @type {Set<string>} */
  #checkedPeers = new Set();
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
      await this._onDownloadableInstallers(installers);
      // After checking (and potentially starting to download) available
      // installers, update the list of peers that have been checked for
      // upgrades
      const prevCheckedPeersCount = this.#checkedPeers.size;
      for (const { url } of installers) {
        try {
          const { host } = new URL(url);
          if (!this.#checkedPeers.has(host)) {
            this.#checkedPeers.add(host);
          }
        } catch (e) {
          // invalid url, ignore
        }
      }
      if (this.#checkedPeers.size > prevCheckedPeersCount) {
        this.emit("state", this.getState());
      }
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
    log("%d: Updated stored installers: %i", this.#port, storedInstallers);
    const upgradeCandidate = getBestUpgradeCandidate({
      deviceInfo: this.#deviceInfo,
      currentApkInfo: this.#currentApkInfo,
      installers: storedInstallers,
    });
    if (!upgradeCandidate) {
      log("%d: No upgrade candidate in storage", this.#port);
      return;
    }
    log("%d: Available upgrade: %i", this.#port, upgradeCandidate);
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
        "%d: Found available upgrade candidate %i",
        this.#port,
        upgradeCandidate
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
          "%d: Upgrade candidate %h is already downloaded",
          this.#port,
          candidateHash
        );
        return;
      }
      // If we are already in the process of downloading an installer with this
      // same hash, ignore this one
      if (this.#downloads.has(candidateHash)) {
        log(
          "%d: Upgrade candidate %h is downloading",
          this.#port,
          candidateHash
        );
        return;
      }
      // If we are already downloading an installer with a higher version number
      // than this one, ignore this one
      for (const { installerInfo } of this.#downloads.values()) {
        if (installerCompare.lte(upgradeCandidate, installerInfo)) {
          log(
            "%d: Already downloading %i which is newer than %h",
            this.#port,
            installerInfo,
            candidateHash
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
          "%d: Upgrade candidate %h is already downloaded",
          this.#port,
          candidateHash
        );
        return;
      }
      // If there are any in progress downloads, cancel them
      for (const { stream, installerInfo } of this.#downloads.values()) {
        log("%d: cancelling download of %i", this.#port, installerInfo);
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

      log("%d: Start download %h", this.#port, candidateHash);
      stream.pipeline(rs, progress, ws, e => {
        if (e) log("%d: Error downloading %h", this.#port, candidateHash);
        else log("%d: Download complete %h", this.#port, candidateHash);
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
      log("%d: Uncaught error processing available downloads", this.#port, e);
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
      checkedPeers: Array.from(this.#checkedPeers),
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
    log("%d: starting", this.#port);
    // When the upgrade server restarts (e.g. after app goes into background and
    // returns to the foreground), then prefer the same port. `this.#port`
    // starts as 0, which we don't want to use.
    this.#port = await getPort({ port: this.#port || undefined });
    await Promise.all([
      this.#discovery.start(this.#port),
      this.#server.start(this.#port),
    ]);
    log("%d: started", this.#port);
  }

  /**
   * Stop all the downloader services
   *
   * @returns {Promise<void>} Resolves when stopped
   */
  async _stop() {
    log("%d: stopping", this.#port);
    await Promise.all([this.#discovery.stop(), this.#server.stop()]);
    this.#checkedPeers.clear();
    log("%d: stopped", this.#port);
  }
}

module.exports = UpgradeManager;
