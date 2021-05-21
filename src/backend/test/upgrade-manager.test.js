// @ts-check
const path = require("path");
const test = require("tape");
const UpgradeManager = require("../lib/upgrade-manager");
const { setupTmpStorageFolder, readJson } = require("./helpers");
const omit = require("lodash/omit");
const scenarios = require("./fixtures/manager-scenarios");

/** @typedef {import('../lib/types').InstallerInt} InstallerInt */
/** @typedef {import("../lib/types").DeviceInfo} DeviceInfo */

const validApksFolder = path.join(__dirname, "./fixtures/valid-apks");

/**
 * @param {object} opts
 * @param {string[]} opts.apkFiles List of files (from validApksFolder) to copy into temp directory
 * @param {string} opts.currentApk File in validApksFolder to use as current Apk
 * @param {DeviceInfo} opts.deviceInfo
 */
async function makeUpgradeManager({ apkFiles, currentApk, deviceInfo }) {
  const filepaths = apkFiles.map(filename =>
    path.join(validApksFolder, filename)
  );
  const currentApkInfo = {
    ...(await readJson(
      path.join(validApksFolder, currentApk.replace(/\.apk$/, ".expected.json"))
    )),
    filepath: path.join(validApksFolder, currentApk),
  };
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

test("Upgrade Manager scenarios", async t => {
  // This will run each scenario for 10 seconds and check the eventual state of
  // each manager instance. Sorry the code is a bit messy - this was a bit
  // rushed, but the logic here should not be too important, the actual thing we
  // are testing are the scenarios in `fixtures/manager-scenarios.js`
  for (const scenario of scenarios) {
    t.test(scenario.description, async st => {
      const expectedEventualStates = await Promise.all(
        scenario.eventualStates.map(async s => {
          const installerInfo =
            typeof s.availableUpgrade === "string"
              ? await readJson(path.join(validApksFolder, s.availableUpgrade))
              : s.availableUpgrade;
          return { ...s, availableUpgrade: installerInfo };
        })
      );

      const managerMakePromises = scenario.managers.map(m =>
        makeUpgradeManager({
          apkFiles: m.storedInstallers,
          deviceInfo: m.deviceInfo,
          currentApk: m.currentApk,
        })
      );
      const managers = await Promise.all(managerMakePromises);

      // Promises to resolve once "final" state is reached
      const statePromises = managers.map(
        ({ manager }) =>
          new Promise(resolve => {
            /** @type {import('../lib/types').UpgradeState | void} */
            let eventualState;
            manager.on("state", state => {
              eventualState = state;
            });
            // Allow 10 seconds to find and download an available upgrade
            setTimeout(() => resolve(eventualState), 10000);
          })
      );

      // Start up all the managers in the scenario
      await Promise.all(managers.map(m => m.manager.start()));

      const eventualStates = await Promise.all(statePromises);
      // Remove filepaths
      const normalizedEventualStates = eventualStates.map(state => ({
        ...state,
        availableUpgrade:
          state.availableUpgrade && omit(state.availableUpgrade, "filepath"),
      }));

      st.equal(
        managers.length,
        eventualStates.length,
        "Scenario passes sanity check!"
      );

      st.deepEqual(normalizedEventualStates, expectedEventualStates);

      await Promise.all(managers.map(m => m.manager.stop()));
    });
  }
});
