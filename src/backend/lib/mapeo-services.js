// @ts-check
const AsyncService = require("./async-service");
const main = require("../index");
const Mapeo = require("./mapeo");
const Project = require("./project");
const path = require("path");
const fs = require("fs");
const debug = require("debug");
const throttle = require("lodash/throttle");
const UpgradeManager = require("../upgrade-manager");
const mkdirp = require("mkdirp");
const { serializeError } = require("serialize-error");

const log = debug("mapeo-core:server");

/** @typedef {import('events').EventEmitter & { post: (event: string, message?: any) => void }} Channel */

/**
 * @extends {AsyncService<{}, [number]>}
 */
export class MapeoServices extends AsyncService {
  #channel;
  #mapeo;
  #project;
  #upgradeManager;
  #dbStorageDir;
  #staticRoot;
  #fallbackPresetsDir;

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
    this.#staticRoot = sharedStorage;
    const metadataPath = path.join(privateStorage, "project_metadata.json");
    const importedConfigPath = path.join(sharedStorage, "presets/default");
    this.#project = new Project({ metadataPath, importedConfigPath });

    this.#dbStorageDir = path.join(
      privateStorage,
      "data",
      this.#project.metadata.id || "practice_project"
    );
    migrateProjectStorageIfNeeded({
      oldStorageDir: privateStorage,
      newStorageDir: this.#dbStorageDir,
    });
    // Folder with default (built-in) presets to server when the user has not
    // added any presets
    this.#fallbackPresetsDir = path.join(
      privateStorage,
      "nodejs-assets/presets"
    );
    const upgradeStoragePath = path.join(privateCacheStorage, "upgrades");
    // create folders for upgrades, imported config & map styles
    mkdirp.sync(importedConfigPath);
    mkdirp.sync(upgradeStoragePath);
    mkdirp.sync(path.join(sharedStorage, "styles/default"));

    this.#mapeo = new Mapeo({
      dbStorageDir: this.#dbStorageDir,
      projectKey: this.#project.metadata.key,
      staticRoot: this.#staticRoot,
      fallbackPresetsDir: this.#fallbackPresetsDir,
    });

    try {
      this.#upgradeManager = new UpgradeManager({
        storageDir: upgradeStoragePath,
        currentApkInfo,
        deviceInfo,
      });
    } catch (err) {
      main.bugsnag.notify(err, {
        severity: "error",
        context: "p2p-upgrade",
      });
      log(`error initializing p2p-upgrade: ${err.toString()}`);
    }

    // Sending data over the bridge to RN is costly, and progress events fire
    // frequently, so we throttle updates to once every 500ms
    this._throttledSendPeerUpdateToRN = throttle(this._sendPeerUpdateToRN, 500);

    this._attachUpgradeManagerListeners();
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

  _attachUpgradeManagerListeners() {
    const upgradeManager = this.#upgradeManager;
    if (upgradeManager) {
      upgradeManager.on("state", onUpgradeManagerState);
      upgradeManager.on("error", err => {
        onError("p2p-upgrade", err);
        const serializedError = serializeError(err);
        this.#channel.post("p2p-upgrade::error", serializedError);
      });
      this.#channel.on("p2p-upgrade::start-services", () => {
        log("Request to start upgrade manager");
        upgradeManager.start().catch(err => onError("p2p-start", err));
      });
      this.#channel.on("p2p-upgrade::stop-services", () => {
        log("Request to stop upgrade manager");
        upgradeManager.stop().catch(err => onError("p2p-stop", err));
      });
      this.#channel.on("p2p-upgrade::get-state", () => {
        // Don't particularly like this way of doing things, eventually we will
        // set up and RPC for calling these methods directly
        const state = upgradeManager.getState();
        onUpgradeManagerState(state);
      });
    } else {
      this.#channel.on("p2p-upgrade::get-state", () => {
        // If UpgradeManager fails to initialize, we always report the state as
        // the error, and ignore all the other IPC messages

        /** @type {import("../upgrade-manager/types").UpgradeState} */
        const state = {
          value: "error",
          error: new Error("Upgrade manager failed to load"),
          uploads: [],
          downloads: [],
          checkedPeers: [],
        };
        onUpgradeManagerState(state);
      });
    }

    /** @param {import("../upgrade-manager/types").UpgradeState} state */
    function onUpgradeManagerState(state) {
      // Serialize error object so it can be transferred over ipc
      const serializedErrorState = {
        ...state,
        error: serializeError(state.error),
      };
      this.#channel.post("p2p-upgrade::state", serializedErrorState);
    }
  }

  /** @param {any} peer */
  _onNewPeer = peer => {
    this._throttledSendPeerUpdateToRN();
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

  /**
   * Send peer state to frontend
   */
  _sendPeerUpdateToRN = () => {
    const peers = this.#mapeo.core.sync.peers().map(
      /** @param {any} peer */ peer => {
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
      }
    );
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
      const projectKey = this.#project.metadata.key;
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

  _leaveSync = () => {
    try {
      const projectKey = this.#project.metadata.key;
      log("Leaving swarm", projectKey && projectKey.slice(0, 4));
      this.#mapeo.core.sync.leave(projectKey);
    } catch (e) {
      main.bugsnag.notify(e, {
        severity: "error",
        context: "sync leave",
      });
    }
  };

  /**
   * @param {object} opts
   * @param {string | number} opts.id
   * @param {string} opts.path
   */
  _replaceConfig = async ({ id, path: configTarballPath }) => {
    const currentProjectKey = this.#project.metadata.key;
    try {
      const newMetadata = await this.#project.importConfig(configTarballPath);
      if (newMetadata.key !== currentProjectKey) {
        await this.#mapeo.destroy();
        this.#mapeo = new Mapeo({
          dbStorageDir: this.#dbStorageDir,
          projectKey: this.#project.metadata.key,
          staticRoot: this.#staticRoot,
          fallbackPresetsDir: this.#fallbackPresetsDir,
        });
        // TODO: re-attach event listeners - this is why we were seeing bugs
        // with sync after replacing config
      }
      this.#channel.post("replace-config-" + id);
    } catch (e) {
      this.#channel.post(
        "replace-config-" + id,
        e.message || new Error("Unknown error")
      );
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

/**
 * @param {string} prefix
 * @param {Error} [err]
 */
function onError(prefix, err) {
  if (!err) return;
  main.bugsnag.notify(err, {
    severity: "error",
    context: prefix,
  });
  log(`error(${prefix}): ' + ${err.toString()}`);
}
