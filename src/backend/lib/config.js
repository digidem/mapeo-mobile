// @ts-check
const fs = require("fs");
const path = require("path");
const tar = require("tar-fs");
const { promisify } = require("util");
const stream = require("stream");
const semverCoerce = require("semver/functions/coerce");
const debug = require("debug");
const { ErrorWithCause } = require("pony-cause");
const fsPromises = fs.promises;
const pipeline = promisify(stream.pipeline);
const log = debug("mapeo-core:project");
const renameOverwrite = require("rename-overwrite");

/** @typedef {import('./types').ProjectInfo} ProjectInfo */
/** @typedef {Pick<ProjectInfo, 'key' | 'name'>} LegacyInfo */

/**
 * A small helper class to manage storage of the current project key and name,
 * and to switch to a different config. Does not deal with deleting data when
 * switching projects.
 */
class Config {
  #importedConfigPath;

  /**
   * @param {object} options
   * @param {string} options.importedConfigPath Path to folder of data imported from a `.mapeoconfig` file
   */
  constructor({ importedConfigPath }) {
    this.#importedConfigPath = importedConfigPath;
  }

  /**
   * Import project config from a .mapeosettings file. Project info in the
   * config file will be ignored.
   *
   * @param {string} configPath Path to .mapeosettings file
   * @returns {Promise<LegacyInfo | undefined>} Project info contained in the config file (legacy version - not used in new onboarding flow)
   */
  async import(configPath) {
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

    // fs.rename gives an error if the destination directory is not empty,
    // despite what the nodejs docs say
    // (https://github.com/nodejs/node/issues/21957)
    try {
      await renameOverwrite(tmpDir, this.#importedConfigPath);
    } catch (e) {
      throw new ErrorWithCause(
        "Error replacing existing config with new config",
        { cause: e }
      );
    }
    log("Successfully replaced config");

    return this.getLegacyProjectInfo();
  }

  /**
   * Read legacy project info from an imported config. This is used if the user
   * has not joined a project via the new onboarding flow
   *
   * @returns {LegacyInfo | undefined}
   */
  getLegacyProjectInfo() {
    /** @type {LegacyInfo} */
    let legacyInfo;

    try {
      const config = JSON.parse(
        fs.readFileSync(this.#importedConfigPath, "utf8")
      );
      if (!config) throw new Error("Unable to read project config");
      const { projectKey, name } = config;
      if (typeof projectKey === "string") {
        log(
          "Using project key from imported custom config",
          config.projectKey.slice(0, 4)
        );
        legacyInfo = {
          key: projectKey,
          name: typeof name === "string" ? name : undefined,
        };
      } else {
        log(
          "No project key defined in imported custom config, setting practice mode"
        );
        legacyInfo = {
          name: typeof name === "string" ? name : undefined,
        };
      }
    } catch (e) {
      log("Error trying to read project config: " + e.message);
      return;
    }

    return legacyInfo;
  }
}

module.exports = Config;
