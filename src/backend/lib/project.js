const path = require("path");
const fs = require("fs");

/** @typedef {{ key: void, name: "Practice Project", practiceMode: true }} PracticeModeConfig */
/** @typedef {{ key: string, name: string, practiceMode: false } | PracticeModeConfig} ProjectConfig */

class Project {
  /**
   * @type {ProjectConfig}
   */
  #config;
  #projectConfigPath;
  #configMetadataPath;

  constructor({ storagePath, defaultConfigPath }) {
    this.#projectConfigPath = path.join(storagePath, "project_config.json");
    this.#configMetadataPath = path.join(defaultConfigPath, "metadata.json");
    this.#config = this._readConfig();
  }

  /** @returns {ProjectConfig} */
  _;
}

module.exports = Project;

function readConfig({ projectConfigPath, configMetadataPath }) {
  try {
    const config = JSON.parse(fs.readFileSync(projectConfigPath));
    if (isValidConfig(config)) {
      if (config.practiceMode) {
        log("Using insecure practice mode");
      } else {
        log("Using project key from storage", config.key.slice(0, 4));
      }
      return config;
    }
  } catch (e) {}
}

/**
 * @param {unknown} config
 * @returns {config is ProjectConfig}
 */
function isValidConfig(config) {
  if (typeof config !== "object") return false;
  if (typeof config.name !== "string") return false;
  if (config.practiceMode === true) {
    if (typeof config.key === "undefined") return true;
    else return false;
  } else if (config.practiceMode === false) {
    if (typeof config.key === "string") return true;
    else return false;
  } else {
    return false;
  }
}
