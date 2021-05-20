// @ts-check
const { promises: fsPromises } = require("fs");
const path = require("path");
const tmp = require("tmp-promise");
const Storage = require("../lib/upgrade-storage");

/** @typedef {import('../lib/types').InstallerInt} InstallerInt */
/** @typedef {import('../lib/types').InstallerExt} InstallerExt */

module.exports = {
  readJson,
  hashCmp,
  setupStorage,
  setupTmpStorageFolder,
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
 * @param {InstallerInt | InstallerExt} a
 * @param {InstallerInt | InstallerExt} b
 * @returns -1 | 0 | 1
 */
function hashCmp(a, b) {
  if (a.hash < b.hash) return -1;
  if (a.hash > b.hash) return 1;
  return 0;
}

/**
 * @param {string[]} filepaths List of files to copy into temp directory
 * @param {InstallerInt} currentApkInfo
 */
async function setupStorage(filepaths, currentApkInfo) {
  const { expected, cleanup, storageDir } = await setupTmpStorageFolder(
    filepaths,
    currentApkInfo
  );
  return {
    expected,
    storage: new Storage({ storageDir, currentApkInfo }),
    cleanup,
    storageDir,
  };
}

/**
 * Create a temp folder and copy filepaths into it. Assumes files have extension
 * `.apk` and they have corresponding `.expected.json` files, which are the
 * expected installer info for the APK
 *
 * Returns an array of expected installerInfo for the folder, including the
 * currentApkInfo (which is not copied into the temp folder)
 *
 * @param {string[]} filepaths List of files to copy into temp directory
 * @param {InstallerInt} currentApkInfo
 */
async function setupTmpStorageFolder(filepaths, currentApkInfo) {
  const tmpDir = await tmp.dir({ unsafeCleanup: true });
  const expected = [];
  for (const filepath of filepaths) {
    const dstFilepath = path.join(tmpDir.path, path.basename(filepath));
    await fsPromises.copyFile(filepath, dstFilepath);
    expected.push({
      // Just an empty object if readJson throws - sorry for ugly syntax
      ...(await readJson(
        filepath.replace(/\.apk$/, ".expected.json")
      ).catch(() => ({}))),
      filepath: dstFilepath,
    });
  }
  expected.push(currentApkInfo);
  return { expected, cleanup: tmpDir.cleanup, storageDir: tmpDir.path };
}
