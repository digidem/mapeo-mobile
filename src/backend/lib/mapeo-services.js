// @ts-check
const AsyncService = require("./async-service");
const Mapeo = require("./mapeo");
const Project = require("./project");
const path = require("path");
const fs = require("fs");
const debug = require("debug");
const UpgradeManager = require("../upgrade-manager");
const createApi = require("./api");
const mkdirp = require("mkdirp");
const { createServer } = require("rpc-reflector");
const KeyManager = require("./key-manager");

const log = debug("mapeo-core:server");

/** @typedef {Parameters<createServer>[1]} Channel */

/**
 * @extends {AsyncService<{ error: (err: Error) => void, state: (state: import('./types').AsyncServiceState) => void }, [number]>}
 */
class MapeoServices extends AsyncService {
  #mapeo;
  #project;
  #upgradeManager;
  #dbStorageDir;
  #staticRoot;
  #fallbackPresetsDir;
  #keyManager;

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
   * @param {string} options.identityKey Identity key used to derive key pairs
   */
  constructor({
    privateStorage,
    sharedStorage,
    privateCacheStorage,
    deviceInfo,
    currentApkInfo,
    channel,
    identityKey,
  }) {
    super();
    this.#staticRoot = sharedStorage;
    const infoPath = path.join(privateStorage, "project_info.json");
    const importedConfigPath = path.join(sharedStorage, "presets/default");
    this.#project = new Project({ infoPath, importedConfigPath });
    const info = this.#project.readInfo();

    this.#keyManager = new KeyManager(identityKey);

    this.#dbStorageDir = path.join(
      privateStorage,
      "data",
      info.id || "practice_project"
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
      projectKey: this.#project.readInfo().key,
      staticRoot: this.#staticRoot,
      fallbackPresetsDir: this.#fallbackPresetsDir,
    });

    // We treat this as a non-fatal error whilst p2p-upgrades is experimental
    try {
      this.#upgradeManager = new UpgradeManager({
        storageDir: upgradeStoragePath,
        currentApkInfo,
        deviceInfo,
      });
    } catch (err) {
      log(err);
      this.emit(
        "error",
        new Error(`error initializing p2p-upgrade: ${err.message}`)
      );
    }

    const api = createApi({
      mapeoCore: this.#mapeo.core,
      project: this.#project,
      upgradeManager: this.#upgradeManager,
      switchProject: this._switchProject,
    });
    createServer(api, channel);

    api.sync.on("error", err => this.emit("error", err));
    api.upgrade.on("error", err =>
      this.emit("error", err || new Error("Unknown Upgrade Services error"))
    );
    super.addStateListener(state => this.emit("state", state));
  }

  /**
   * Start all Mapeo services.
   * @param {number} port
   * @returns {Promise<void>}
   */
  async _start(port) {
    await this.#mapeo.start(port);
  }

  async _stop() {
    await this.#mapeo.stop();
  }

  /**
   * NB: this is bound to `this` due to the methodName = () => {} syntax
   *
   * @private
   * @param {string | undefined} projectKey
   * @param {object} [opts]
   * TODO: Add options to migrate data to new project
   * @returns {Promise<any>} Mapeo Core instance
   */
  _switchProject = async (projectKey, opts = {}) => {
    await this.#mapeo.destroy();
    this.#mapeo = new Mapeo({
      dbStorageDir: this.#dbStorageDir,
      projectKey,
      staticRoot: this.#staticRoot,
      fallbackPresetsDir: this.#fallbackPresetsDir,
    });
    return this.#mapeo.core;
  };
}

module.exports = MapeoServices;

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
    throw new Error(
      "Unexpected migration error: new storage folder exists, but old storage folder exists also"
    );
  } else if (!oldStorageExists && newStorageExists) {
    log("Project storage already migrated");
  } else {
    log("No existing project database detected, skipping migration");
  }
}
