// @ts-check
const crypto = require("hypercore-crypto");
const JsonDb = require("./json-db");

/** @typedef {import('./types').ProjectInfo} ProjectInfo */
/** @typedef {import('./config').LegacyInfo} LegacyInfo */
/** @typedef {'name'} UpdateableProjectProps */

/**
 * @param {LegacyInfo | undefined} legacyInfo
 * @returns {legacyInfo is import('./types').JoinedProjectInfo}
 */
function hasLegacyKey(legacyInfo) {
  return !!(legacyInfo && legacyInfo.key);
}

/**
 * Read and update project info and switch between projects
 */
class Project {
  #db;
  #switchProject;

  static hasLegacyKey = hasLegacyKey;

  /**
   * @param {object} options
   * @param {string} options.infoPath Path the JSON file used to store the info of the current project
   * @param {import('./mapeo-services')['_switchProject']} options.switchProject
   * @param {LegacyInfo} [options.legacyInfo] Legacy project info (read from mapeo config file) - defaults to practice project
   */
  constructor({ infoPath, switchProject, legacyInfo }) {
    /** @type {ProjectInfo} */
    const initialValue = hasLegacyKey(legacyInfo)
      ? {
          ...legacyInfo,
          id: discoveryKey(legacyInfo.key),
          practiceMode: false,
        }
      : {
          name: legacyInfo && legacyInfo.name,
          practiceMode: true,
        };
    this.#db = new JsonDb(infoPath, initialValue);
    this.#switchProject = switchProject;
  }

  get() {
    // Clone so that this cannot be modified from outside this class
    return { ...this.#db.data };
  }

  /**
   * Update project info. Currently only the name can be changed.
   *
   * @param {Pick<ProjectInfo, UpdateableProjectProps>} projectInfo
   * @returns {ProjectInfo}
   */
  update(projectInfo) {
    this.#db.data.name = projectInfo.name;
    this.#db.write();
    return this.get();
  }

  /**
   * Join a project. Currently brings all existing data into the new project.
   *
   * @param {Omit<import('./types').JoinedProjectInfo, 'id' | 'practiceMode'>} projectInfo
   * @returns {Promise<any>} Mapeo Core instance for the new project
   */
  async join(projectInfo) {
    this.#db.data = {
      ...projectInfo,
      id: discoveryKey(projectInfo.key),
      practiceMode: false,
    };
    const mapeoCore = await this.#switchProject(this.#db.data, {
      keepData: true,
    });
    this.#db.write();
    return mapeoCore;
  }

  /**
   * Leave a project, deleting all data. This is a destructive operation. User will be left in practice mode.
   * @returns {Promise<any>} Mapeo Core instance for practice mode project
   */
  async leave() {
    this.#db.data = { practiceMode: true };
    const mapeoCore = await this.#switchProject(this.#db.data, {
      keepData: false,
    });
    this.#db.write();
    return mapeoCore;
  }
}

module.exports = Project;

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
