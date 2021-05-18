// @ts-check
const { promises: fsPromises } = require("fs");

/** @typedef {import('../lib/types').InstallerInt} InstallerInt */

module.exports = {
  readJson,
  hashCmp,
};

/**
 * @param {string} filepath
 * @returns {Promise<any>}
 */
async function readJson(filepath) {
  return JSON.parse(await fsPromises.readFile(filepath, "utf-8"));
}

/**
 * Helper to deterministically sort installers by hash
 *
 * @param {InstallerInt} a
 * @param {InstallerInt} b
 * @returns -1 | 0 | 1
 */
function hashCmp(a, b) {
  if (a.hash < b.hash) return -1;
  if (a.hash > b.hash) return 1;
  return 0;
}
