// @ts-check

const UpgradeStorage = require("./upgrade-storage");
const UpgradeServer = require("./upgrade-server");
const UpgradeDiscovery = require("./upgrade-discovery");
const AsyncService = require("./async-service");
const { getBestUpgradeCandidate, installerCompare } = require("./utils");
const stream = require("stream");
const progressStream = require("progress-stream");
const throttle = require("lodash/throttle");

const log = require("debug")("p2p-upgrades:manager");

const getPort = require("get-port");

/** @typedef {import('./types').UpgradeState} UpgradeState */
/** @typedef {import('./types').InstallerExt} InstallerExt */
/** @typedef {import('./types').InstallerInt} InstallerInt */
/** @typedef {import('./types').TransferProgress} TransferProgress */
/**
 * @typedef {Object} Events
 * @property {(state: UpgradeState) => void} state
 * @property {(error?: Error) => void} error
 */

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
  /** @type {UpgradeState} */
  #state = {
    value: "stopped",
    downloads: [],
    uploads: [],
    availableUpgrade: undefined,
  };
  /** @type {Map<string, { progress: TransferProgress, stream: import('stream').Readable, installerInfo: InstallerExt }>} */
  #downloads = new Map();
  /**
   * @param {object} options
   * @param {string} options.storageDir Path to folder to store installers
   * @param {InstallerInt} options.currentApkInfo info about the currently installed APK
   * @param {import('./types').DeviceInfo} options.deviceInfo Arch and SDK version of current device
   * @param {number} [options.stateEmitThrottle=400] ms throttle for state events. Used for testing
   */
  constructor({
    storageDir,
    currentApkInfo,
    deviceInfo,
    stateEmitThrottle = 400,
  }) {
    super();
    /** @private */
    this._currentApkInfo = currentApkInfo;
    /** @private */
    this._deviceInfo = deviceInfo;
    /** @private */
    this._storage = new UpgradeStorage({ storageDir, currentApkInfo });
    /** @private */
    this._server = new UpgradeServer({ storage: this._storage });
    /** @private */
    this._discovery = new UpgradeDiscovery({
      discoveryKey: currentApkInfo.applicationId,
    });

    this._server.on("uploads", uploads => {
      this.setState({ uploads });
    });
    this._server.on("error", error => {
      this.emit("error", error);
    });
    this._storage.on("error", error => {
      this.setState({ value: "error", error });
    });
    this._storage.on("installers", async installers => {
      this._onStoredInstallers(installers);
    });
    this._discovery.on("installers", async installers => {
      this._onDownloadableInstallers(installers);
    });
    this.throttledEmitState = throttle(() => {
      this.emit("state", this.getState());
    }, stateEmitThrottle);
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
    const upgradeCandidate = getBestUpgradeCandidate({
      deviceInfo: this._deviceInfo,
      currentApkInfo: this._currentApkInfo,
      installers: storedInstallers,
    });
    if (!upgradeCandidate) return;
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
        deviceInfo: this._deviceInfo,
        currentApkInfo: this._currentApkInfo,
        installers: downloadableInstallers,
      });
      // If none of the downloadable installers are an upgrade candidate, ignore
      if (!upgradeCandidate) return;
      const { hash: candidateHash } = upgradeCandidate;
      const { availableUpgrade } = this.getState();
      // If we have an availableUpgrade in storage already, and this
      // upgradeCandidate is not any newer, ignore it
      if (
        availableUpgrade &&
        installerCompare(upgradeCandidate, availableUpgrade) < 1
      )
        return;
      // If we are already in the process of downloading an installer with this
      // same hash, ignore this one
      if (this.#downloads.has(candidateHash)) return;
      // If we are already downloading an installer with a higher version number
      // than this one, ignore this one
      for (const { installerInfo } of this.#downloads.values()) {
        if (installerCompare(upgradeCandidate, installerInfo) < 1) return;
      }
      const currentInstallers = await this._storage.list();
      // If we this upgrade candidate is already in storage, we can ignore it
      if (currentInstallers.find(installer => installer.hash === candidateHash))
        return;
      // If there are any in progress downloads, cancel them
      for (const { stream } of this.#downloads.values()) {
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

      const rs = this._discovery.createReadStream(candidateHash);
      const progress = progressStream(
        { length: upgradeCandidate.size },
        progress => {
          // Warning: we mutate the download object to avoid recreating an
          // object on every progress event, and also re-setting this.#downloads
          download.sofar = progress.transferred;
          this.throttledEmitState();
        }
      );
      const ws = this._storage.createWriteStream({ hash: candidateHash });

      stream.pipeline(rs, progress, ws, e => {
        this.#downloads.delete(candidateHash);
      });

      this.#downloads.set(candidateHash, {
        stream: rs,
        progress: download,
        installerInfo: upgradeCandidate,
      });
    } catch (e) {
      log("Uncaught error processing available downloads", e);
      this.setState({ value: "error", error: e });
    }
  }

  /**
   * Get current state of UpgradeManager
   *
   * @returns {UpgradeState}
   */
  getState() {
    return {
      ...this.#state,
      // Don't like this too much, but for now is better than duplicating
      // downloads on state
      downloads: Array.from(this.#downloads.values()).map(
        download => download.progress
      ),
    };
  }

  /**
   * Set state of UpgradeManager, **merges with current state**. If you pass
   * state with value: "error" you _must_ also pass an error property
   *
   * @param {Partial<Exclude<UpgradeState, { value: "error", error: Error }>> | { value: "error", error: Error }} statePartial
   */
  setState(statePartial) {
    this.#state = { ...this.#state, ...statePartial };
    this.throttledEmitState();
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
    log("got request to start services");
    const port = await getPort();
    await Promise.all([this._discovery.start(port), this._server.start(port)]);
    log("Started services");
  }

  /**
   * Stop all the downloader services
   *
   * @returns {Promise<void>} Resolves when stopped
   */
  async _stop() {
    log("got request to stop services");
    await Promise.all([this._discovery.stop(), this._server.stop()]);
    log("Stopped services");
  }
}

module.exports = UpgradeManager;
