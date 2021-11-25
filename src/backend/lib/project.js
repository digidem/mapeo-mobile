// @ts-check
const fs = require("fs");
const path = require("path");
const tar = require("tar-fs");
const { promisify } = require("util");
const stream = require("stream");
const semverCoerce = require("semver/functions/coerce");
const debug = require("debug");
const { ErrorWithCause } = require("pony-cause");
const rimraf = promisify(require("rimraf"));
const fsPromises = fs.promises;
const pipeline = promisify(stream.pipeline);
const crypto = require("hypercore-crypto");
const log = debug("mapeo-core:project");

/** @typedef {import('./types').ProjectInfo} ProjectInfo */

/**
 * A small helper class to manage storage of the current project key and name,
 * and to switch to a different config. Does not deal with deleting data when
 * switching projects.
 */
class Project {
  /** @type {ProjectInfo} */
  #info;
  #infoPath;
  #importedConfigPath;

  /**
   * @param {object} options
   * @param {string} options.infoPath Path the JSON file used to store the info of the current project
   * @param {string} options.importedConfigPath Path to folder of data imported from a `.mapeoconfig` file
   */
  constructor({ infoPath, importedConfigPath }) {
    this.#infoPath = infoPath;
    this.#importedConfigPath = importedConfigPath;
    this.#info = this._readInfo();
  }

  readInfo() {
    // Clone so that this cannot be modified from outside this class
    return { ...this.#info };
  }

  /**
   * @param {import('./types').PracticeModeInfo | Omit<import('./types').JoinedProjectInfo, 'id'>} newInfo
   * @returns {ProjectInfo}
   */
  updateInfo(newInfo) {
    if (newInfo.practiceMode) {
      log("Switching project to practice mode");
      this.#info = newInfo;
    } else {
      log("Switching project to key", newInfo.key.slice(0, 4));
      this.#info = { ...newInfo, id: discoveryKey(newInfo.key) };
    }
    this._writeInfo(this.#info);
    return { ...this.#info };
  }

  /**
   * Import project config from a .mapeosettings file. Project info in the
   * config file will be ignored.
   *
   * @param {string} configPath Path to .mapeosettings file
   * @returns {Promise<ProjectInfo>}
   */
  async importConfig(configPath) {
    const tmpDir = path.join(
      this.#importedConfigPath,
      "..",
      "tmp-" + (Math.random() * Math.pow(10, 10)).toFixed(0)
    );
    try {
      await fsPromises.mkdir(tmpDir);
    } catch (e) {
      throw new ErrorWithCause(
        "Could not create tmp directory for config extract",
        { cause: e }
      );
    }
    const source = fs.createReadStream(configPath);
    const dest = tar.extract(tmpDir, {
      readable: true,
      writable: true,
      // Samsung devices throw EPERM error if you try to set utime
      // @ts-ignore This is undocumented but here: https://github.com/mafintosh/tar-fs/blob/master/index.js#L208
      utimes: false,
    });
    try {
      await pipeline(source, dest);
    } catch (e) {
      throw new ErrorWithCause("Error extracting config tarball", { cause: e });
    }

    let parsedVersion;
    try {
      const version = await fsPromises.readFile(
        path.join(tmpDir, "VERSION"),
        "utf8"
      );
      parsedVersion = semverCoerce(version);
      if (parsedVersion == null) {
        throw new Error(`Could not parse config version: ${version}`);
      }
    } catch (e) {
      throw new ErrorWithCause(
        "Error reading VERSION file from imported config",
        { cause: e }
      );
    }
    if (parsedVersion.major > 3 || parsedVersion.major < 2) {
      throw new Error(`Incompatible config version: ${parsedVersion.format()}`);
    }
    log("Importing config version: " + parsedVersion.format());

    // Need to rimraf() because fs.rename gives an error if the destination
    // directory is not empty, despite what the nodejs docs say
    // (https://github.com/nodejs/node/issues/21957)
    try {
      await rimraf(this.#importedConfigPath);
    } catch (e) {
      throw new ErrorWithCause("Error trying to remove existing config", {
        cause: e,
      });
    }
    try {
      await fsPromises.rename(tmpDir, this.#importedConfigPath);
    } catch (e) {
      throw new ErrorWithCause(
        "Error replacing existing config with new config",
        { cause: e }
      );
    }
    log("Successfully replaced config");

    // Current behaviour is for info from the imported config to be ignored
    // if the project has been created via the new project onboarding flow.
    this.#info = this._readInfo();
    return this.#info;
  }

  /**
   * @private
   * @param {ProjectInfo} info
   */
  _writeInfo(info) {
    fs.writeFileSync(this.#infoPath, JSON.stringify(info));
  }

  /**
   * Read project info, with a fallback to info from an imported config
   * Will migrate the info from the imported config to the new project
   * info format if necessary
   *
   * @private
   * @returns {ProjectInfo}
   */
  _readInfo() {
    try {
      const config = JSON.parse(fs.readFileSync(this.#infoPath, "utf-8"));
      if (isValidConfig(config)) {
        if (config.practiceMode) {
          log("Using insecure practice mode");
        } else {
          log("Using project key from storage", config.key.slice(0, 4));
        }
        return config;
      }
    } catch (e) {
      log("Error trying to read project config " + e.message);
    }

    /** @type {ProjectInfo} */
    let migratedInfo;

    try {
      const info = JSON.parse(
        fs.readFileSync(this.#importedConfigPath, "utf8")
      );
      if (!info) throw new Error("Unable to read project config info");
      const { projectKey, name } = info;
      if (typeof projectKey === "string") {
        log(
          "Using project key from imported custom config",
          info.projectKey.slice(0, 4)
        );
        migratedInfo = {
          id: discoveryKey(projectKey),
          key: projectKey,
          name: typeof name === "string" ? name : undefined,
          practiceMode: false,
        };
      } else {
        log(
          "No project key defined in imported custom config, setting practice mode"
        );
        migratedInfo = {
          name: typeof name === "string" ? name : undefined,
          practiceMode: true,
        };
      }
    } catch (e) {
      log(
        "Error trying to read project info, setting practice mode: " + e.message
      );
      migratedInfo = {
        practiceMode: true,
      };
    }

    try {
      this._writeInfo(migratedInfo);
      log("Migrated project config to new format");
    } catch (e) {
      log("Error trying to migrate config: " + e.message);
    }

    return migratedInfo;
  }
}

module.exports = Project;

/**
 * @param {unknown} config
 * @returns {config is ProjectInfo}
 */
function isValidConfig(config) {
  if (typeof config !== "object") return false;
  if (config == null) return false;
  const typeAssertedConfig = /** @type {ProjectInfo} */ (config);
  if (typeof typeAssertedConfig.name !== "string") return false;
  if (typeAssertedConfig.practiceMode === true) {
    if (typeof typeAssertedConfig.key === "undefined") return true;
    else return false;
  } else if (typeAssertedConfig.practiceMode === false) {
    if (typeof typeAssertedConfig.key === "string") return true;
    else return false;
  } else {
    return false;
  }
}

/**
 * Generate a discovery key for a given projectKey. If projectKey is undefined
 * then it will use SYNC_DEFAULT_KEY as the discovery key (this is for backwards
 * compatibility with clients that did not use projectKeys)
 *
 * @param {String|Buffer} projectKey A unique random key identifying the
 * project. Must be 32-byte Buffer or a string hex encoding of a 32-Byte buffer
 * @returns {string} A hex encoded 32-byte Buffer
 */
function discoveryKey(projectKey) {
  if (typeof projectKey === "string") {
    projectKey = Buffer.from(projectKey, "hex");
  }
  if (Buffer.isBuffer(projectKey) && projectKey.length === 32) {
    return crypto.discoveryKey(projectKey).toString("hex");
  } else {
    throw new Error(
      "projectKey must be undefined or a 32-byte Buffer, or a hex string encoding a 32-byte buffer"
    );
  }
}
