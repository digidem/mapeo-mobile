// @ts-check

// These are scenarios for testing UpgradeManager. Each scenario defines an
// array of manager instances, which simulate different devices, each running a
// different APK version, and optionally having other installers in storage.
// Each scenario has an expected "eventual state", which by default we expect to
// reach in 10 seconds. E.g. if we have two devices and one is running the more
// recent version of the APK, we would expect in the "eventual state" the device
// with the older version would have the newer installer as an
// "availableUpgrade"

// Filenames refer to files in the `fixtures/valid-apks` folder

/** @type {import('../../lib/types').DeviceInfo} */
const defaultDeviceInfo = {
  supportedAbis: ["armeabi-v7a", "arm64-v8a"],
  sdkVersion: 21,
};

/** @typedef {import('../../lib/types').UpgradeState} UpgradeState */

/**
 * @typedef {object} ManagerOptions
 * @property {string} currentApk
 * @property {string[]} storedInstallers
 * @property {import('../../lib/types').DeviceInfo} deviceInfo
 */

/**
 * @typedef {object} Scenario
 * @property {string} description
 * @property {ManagerOptions[]} managers
 * @property {Array<Omit<UpgradeState, 'availableUpgrade'> & { availableUpgrade?: string }>} eventualStates
 */

/** @type {Scenario[]} */
const scenarios = [
  {
    description: `- 2 devices
- 2nd is running newer version
- no installers in storage on either DeviceInfo
- 1st device ends up with the installer from 2nd available`,
    managers: [
      {
        currentApk: "com.example.test_SDK21_VN1.0.0_VC1.apk",
        storedInstallers: [],
        deviceInfo: defaultDeviceInfo,
      },
      {
        currentApk: "com.example.test_SDK21_VN1.1.0_VC1.apk",
        storedInstallers: [],
        deviceInfo: defaultDeviceInfo,
      },
    ],
    eventualStates: [
      {
        value: "started",
        downloads: [],
        uploads: [],
        availableUpgrade: "com.example.test_SDK21_VN1.1.0_VC1.expected.json",
      },
      {
        value: "started",
        downloads: [],
        uploads: [],
      },
    ],
  },
];

module.exports = scenarios;
