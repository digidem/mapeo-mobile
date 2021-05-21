// @ts-check
const path = require("path");
const test = require("tape");
const UpgradeManager = require("../lib/upgrade-manager");
const { setupTmpStorageFolder, readJson } = require("./helpers");
const omit = require("lodash/omit");

/** @typedef {import('../lib/types').InstallerInt} InstallerInt */
/** @typedef {import("../lib/types").DeviceInfo} DeviceInfo */

/** @type {DeviceInfo} */
const fakeDeviceInfo = {
  supportedAbis: ["armeabi-v7a", "arm64-v8a"],
  sdkVersion: 21,
};

const validApksFolder = path.join(__dirname, "./fixtures/valid-apks");

/**
 * @param {object} opts
 * @param {string[]} opts.apkFiles List of files (from validApksFolder) to copy into temp directory
 * @param {InstallerInt} opts.currentApkInfo
 * @param {DeviceInfo} opts.deviceInfo
 */
async function makeUpgradeManager({ apkFiles, currentApkInfo, deviceInfo }) {
  const filepaths = apkFiles.map(filename =>
    path.join(validApksFolder, filename)
  );
  const { storageDir, expected, cleanup } = await setupTmpStorageFolder(
    filepaths,
    currentApkInfo
  );
  const manager = new UpgradeManager({
    storageDir,
    currentApkInfo,
    deviceInfo,
  });
  return {
    manager,
    expected,
    async cleanup() {
      await manager.stop();
      await cleanup();
    },
  };
}

test("Upgrade Manager finds & downloads an upgrade from another device", async t => {
  const v100Filepath = path.join(
    validApksFolder,
    "com.example.test_SDK21_VN1.0.0_VC1.apk"
  );
  const v110Filepath = path.join(
    validApksFolder,
    "com.example.test_SDK21_VN1.1.0_VC1.apk"
  );
  const v100ApkInfo = await readJson(
    v100Filepath.replace(/\.apk$/, ".expected.json")
  );
  v100ApkInfo.filepath = v100Filepath;
  const v110ApkInfo = await readJson(
    v110Filepath.replace(/\.apk$/, ".expected.json")
  );
  v110ApkInfo.filepath = v110Filepath;

  const manager1 = await makeUpgradeManager({
    apkFiles: [],
    deviceInfo: fakeDeviceInfo,
    // manager1 is running the newer version v1.1.0
    currentApkInfo: v110ApkInfo,
  });
  const manager2 = await makeUpgradeManager({
    apkFiles: [],
    deviceInfo: fakeDeviceInfo,
    // manager2 is running older version v1.0.0
    currentApkInfo: v100ApkInfo,
  });

  const testPromise = new Promise((resolve, reject) => {
    let resolved = false;
    manager2.manager.on("state", state => {
      if (state.availableUpgrade) {
        if (resolved) return;
        resolved = true;
        resolve(state.availableUpgrade);
      }
    });
    // Allow 10 seconds to find and download an available upgrade
    setTimeout(reject, 10000);
  });

  await Promise.all([manager1.manager.start(), manager2.manager.start()]);

  try {
    const availableUpgrade = await testPromise;
    t.deepEqual(
      omit(availableUpgrade, "filepath"),
      omit(v110ApkInfo, "filepath"),
      "Expected upgrade from manager1 is available on manager2"
    );
  } catch (e) {
    t.fail("Timed out before the upgrade became available");
  }

  await Promise.all([manager1.cleanup(), manager2.cleanup()]);
});
