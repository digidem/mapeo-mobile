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

/** @typedef {{ key?: undefined, name: "Practice Project", practiceMode: true }} PracticeModeMetadata */
/** @typedef {{ id: string, key: string, name: string, practiceMode: false } | PracticeModeMetadata} ProjectMetadata */

/**
 * A small helper class to manage storage of the current project key and name,
 * and to switch to a different config. Does not deal with deleting data when
 * switching projects.
 */
class Project {
  /** @type {ProjectMetadata} */
  #metadata;
  #metadataPath;
  #importedConfigPath;

  /**
   * @param {object} options
   * @param {string} options.metadataPath Path the JSON file used to store the metadata of the current project
   * @param {string} options.importedConfigPath Path to folder of data imported from a `.mapeoconfig` file
   */
  constructor({ metadataPath, importedConfigPath }) {
    this.#metadataPath = metadataPath;
    this.#importedConfigPath = importedConfigPath;
    this.#metadata = this._readMetadata();
  }

  get metadata() {
    // Clone so that this cannot be modified from outside this class
    return { ...this.#metadata };
  }

  /** @param {ProjectMetadata} newMetadata */
  switchProject(newMetadata) {
    if (newMetadata.key) {
      log("Switching project to key", newMetadata.key.slice(0, 4));
    } else {
      log("Switching project to practice mode");
    }
    this.#metadata = newMetadata;
    this._writeMetadata(newMetadata);
  }

  /**
   * Import project config from a .mapeosettings file. Project metadata in the
   * config file will be ignored.
   *
   * @param {string} configPath Path to .mapeosettings file
   * @returns {Promise<ProjectMetadata>}
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

    // Current behaviour is for metadata from the imported config to be ignored
    // if the project has been created via the new project onboarding flow.
    this.#metadata = this._readMetadata();
    return this.#metadata;
  }

  /** @param {ProjectMetadata} metadata */
  _writeMetadata(metadata) {
    fs.writeFileSync(this.#metadataPath, JSON.stringify(metadata));
  }

  /**
   * Read project metadata, with a fallback to metadata from an imported config
   * Will migrate the metadata from the imported config to the new project
   * metadata format if necessary
   *
   * @returns {ProjectMetadata}
   */
  _readMetadata() {
    try {
      const config = JSON.parse(fs.readFileSync(this.#metadataPath, "utf-8"));
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

    /** @type {ProjectMetadata} */
    let migratedMetadata;

    try {
      const metadata = JSON.parse(
        fs.readFileSync(this.#importedConfigPath, "utf8")
      );
      if (!metadata) throw new Error("Unable to read project config metadata");
      const { projectKey, name } = metadata;
      if (typeof projectKey === "string") {
        log(
          "Using project key from imported custom config",
          metadata.projectKey.slice(0, 4)
        );
        migratedMetadata = {
          id: discoveryKey(projectKey),
          key: projectKey,
          name: name || "Practice Project",
          practiceMode: false,
        };
      } else {
        log(
          "No project key defined in imported custom config, setting practice mode"
        );
        migratedMetadata = {
          name: name || "Practice Project",
          practiceMode: true,
        };
      }
    } catch (e) {
      log(
        "Error trying to read project metadata, setting practice mode: " +
          e.message
      );
      migratedMetadata = {
        name: "Practice Project",
        practiceMode: true,
      };
    }

    try {
      this._writeMetadata(migratedMetadata);
      log("Migrated project config to new format");
    } catch (e) {
      log("Error trying to migrate config: " + e.message);
    }

    return migratedMetadata;
  }
}

module.exports = Project;

/**
 * @param {unknown} config
 * @returns {config is ProjectMetadata}
 */
function isValidConfig(config) {
  if (typeof config !== "object") return false;
  if (config == null) return false;
  const typeAssertedConfig = /** @type {ProjectMetadata} */ (config);
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
