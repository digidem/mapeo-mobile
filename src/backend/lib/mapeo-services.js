// @ts-check
const AsyncService = require("./async-service");
const main = require("../index");
const Mapeo = require("./mapeo");
const fs = require("fs");
const debug = require("debug");
const throttle = require("lodash/throttle");

const log = debug("mapeo-core:server");

/** @typedef {import('events').EventEmitter & { post: (event: string, message: any) => void }} Channel */

// From https://github.com/kappa-db/multifeed - default key used by Mapeo Core
// when no other key has been provided.
const DEFAULT_PROJECT_KEY =
  "bee80ff3a4ee5e727dc44197cb9d25bf8f19d50b0f3ad2984cfe5b7d14e75de7";

/**
 * @extends {AsyncService<{}, [number]>}
 */
export class MapeoServices extends AsyncService {
  #channel;
  #mapeo;

  /**
   * @param {object} options
   * @param {string} options.privateStorage Path to app-specific internal file storage
   *   folder (see https://developer.android.com/training/data-storage/app-specific).
   *   This folder cannot be accessed by other apps or the user via a computer connection.
   * @param {string} options.sharedStorage Path to app-specific external file storage folder
   * @param {string} options.privateCacheStorage Path to app-specific internal cache storage folder
   * @param {import('../upgrade-manager/types').DeviceInfo} options.deviceInfo sdkVersion and supportedAbis for current device
   * @param {import('../upgrade-manager/types').InstallerInt} options.currentApkInfo info about the currently running APK (see ./lib/types for documentation)
   * @param {Channel} options.channel
   */
  constructor({
    privateStorage,
    sharedStorage,
    privateCacheStorage,
    deviceInfo,
    currentApkInfo,
    channel,
  }) {
    super();
    this.#channel = channel;
    this.#mapeo = new Mapeo();
    // Sending data over the bridge to RN is costly, and progress events fire
    // frequently, so we throttle updates to once every 500ms
    this._throttledSendPeerUpdateToRN = throttle(this._sendPeerUpdateToRN, 500);
  }

  /**
   * Start all Mapeo services.
   * @param {number} port
   * @returns {Promise<void>}
   */
  async _start(port) {
    await this.#mapeo.start(port);
    this.#mapeo.core.sync.on("peer", this._onNewPeer);
    this.#mapeo.core.sync.on("peer", this._onNewPeer);
    this.#mapeo.core.sync.on("down", this._throttledSendPeerUpdateToRN);
    this.#channel.on("sync-start", this._startSync);
    this.#channel.on("sync-join", this._joinSync);
    this.#channel.on("sync-leave", this._leaveSync);
    this.#channel.on("replace-config", this._replaceConfig);
  }

  async _stop() {
    this.#mapeo.core.sync.removeListener("peer", this._onNewPeer);
    this.#mapeo.core.sync.removeListener(
      "down",
      this._throttledSendPeerUpdateToRN
    );
    this.#channel.removeListener("sync-start", this._startSync);
    this.#channel.removeListener("sync-join", this._joinSync);
    this.#channel.removeListener("sync-leave", this._leaveSync);
    this.#channel.removeListener("replace-config", this._replaceConfig);
    await this.#mapeo.stop();
  }

  /** @param {any} peer */
  _onNewPeer = peer => {
    this._throttledSendPeerUpdateToRN(peer);
    if (!peer.sync) {
      return log("Could not monitor peer, missing sync property");
    }
    peer.sync.once("sync-start", () => {
      this._syncWatch(peer.sync);
    });
  };

  /** @param {any} sync */
  _syncWatch = sync => {
    const startTime = Date.now();
    sync.on("error", onerror);
    sync.on("progress", this._throttledSendPeerUpdateToRN);
    sync.on("end", onend);
    this._sendPeerUpdateToRN();

    /** @param {Error} err */
    function onerror(err) {
      main.bugsnag.notify(err, {
        severity: "error",
        context: "sync",
      });
      this._sendPeerUpdateToRN();
      sync.removeListener("error", onerror);
      sync.removeListener("progress", this._throttledSendPeerUpdateToRN);
      sync.removeListener("end", onend);
    }

    /** @param {Error} [err] */
    function onend(err) {
      if (err) log(err.message);
      const syncDurationSecs = ((Date.now() - startTime) / 1000).toFixed(2);
      log("Sync completed in " + syncDurationSecs + " seconds");
      sync.removeListener("error", onerror);
      sync.removeListener("progress", this._throttledSendPeerUpdateToRN);
      sync.removeListener("end", onend);
      this._sendPeerUpdateToRN();
    }
  };

  // Send peer state to frontend
  _sendPeerUpdateToRN = () => {
    const peers = this.#mapeo.core.sync.peers().map(peer => {
      const { connection, ...rest } = peer;
      return {
        ...rest,
        channel: Buffer.isBuffer(rest.channel)
          ? rest.channel.toString("hex")
          : undefined,
        swarmId: Buffer.isBuffer(rest.swarmId)
          ? rest.swarmId.toString("hex")
          : undefined,
      };
    });
    this.#channel.post("peer-update", peers);
  };

  /** @param {any} target */
  _startSync = (target = {}) => {
    if (!target.host || !target.port) return;
    const sync = this.#mapeo.core.sync.replicate(target, {
      deviceType: "mobile",
    });
    this._syncWatch(sync);
  };

  /** @param {any} opts */
  _joinSync = ({ deviceName } = {}) => {
    try {
      if (deviceName) this.#mapeo.core.sync.setName(deviceName);
      log("Joining swarm", projectKey && projectKey.slice(0, 4));
      this.#mapeo.core.sync.join(projectKey);
    } catch (e) {
      main.bugsnag.notify(e, {
        severity: "error",
        context: "sync join",
      });
    }
  };
}

/**
 * Previously the Mapeo database was stored directly under the private storage
 * folder. In preparation for multiple projects we move to storing the database
 * in a folder named with the projectId.
 *
 * @param {object} options
 * @param {string} options.oldStorageDir
 * @param {string} options.newStorageDir
 */
function migrateProjectStorageIfNeeded({ oldStorageDir, newStorageDir }) {
  const oldStorageExists = fs.existsSync(path.join(oldStorageDir, "db"));
  const newStorageExists = fs.existsSync(path.join(newStorageDir, "db"));
  if (oldStorageExists && !newStorageExists) {
    log("Migrating project storage");
    fs.renameSync(
      path.join(oldStorageDir, "db"),
      path.join(newStorageDir, "db")
    );
    fs.renameSync(
      path.join(oldStorageDir, "index"),
      path.join(newStorageDir, "index")
    );
    fs.renameSync(
      path.join(oldStorageDir, "media"),
      path.join(newStorageDir, "media")
    );
  } else if (oldStorageExists && newStorageExists) {
    main.bugsnag.notify(
      new Error(
        "Unexpected migration error: new storage folder exists, but old storage folder exists also"
      ),
      {
        severity: "warning",
        context: "core",
      }
    );
  } else if (!oldStorageExists && newStorageExists) {
    log("Project storage already migrated");
  } else {
    log("No existing project database detected, skipping migration");
  }
}
