// @ts-check
const test = require("tape");
const path = require("path");
const { playDevicePlan, validApksFolder } = require("./helpers");
const hasha = require("hasha");

/** @typedef {import('../lib/types').InstallerInt} InstallerInt */
/** @typedef {import("../lib/types").DevicePlan} DevicePlan */

/** @type {import('../lib/types').DeviceInfo} */
const defaultDeviceInfo = {
  supportedAbis: ["armeabi-v7a", "arm64-v8a"],
  sdkVersion: 21,
};

test("One device updates another", async t => {
  /** @type {DevicePlan} */
  const device1Plan = {
    label: "device1",
    config: {
      currentApk: "com.example.test_SDK21_VN1.0.0_VC1.apk",
      deviceInfo: defaultDeviceInfo,
      autoStart: true,
    },
    steps: [
      {
        eventName: "state",
        waitFor: { value: "started" },
      },
      {
        message: "download of update started",
        eventName: "state",
        waitFor: {
          downloads: [
            {
              id:
                // Expected hash of update on device2
                "550f1eec073f07dad4c507ff339a48be895a450110874e8f3b87d572e6368307",
            },
          ],
        },
        never: {
          // Uploads should never be uploading
          uploads: [{}],
        },
      },
      {
        message: "update is downloaded and available",
        eventName: "state",
        waitFor: {
          downloads: [],
          availableUpgrade: "com.example.test_SDK21_VN1.1.0_VC1.expected.json",
        },
        never: {
          // Uploads should never be uploading
          uploads: [{}],
        },
      },
      async manager => {
        const state = manager.getState();
        if (!state.availableUpgrade) throw new Error("Should not happen");
        const upgrade = state.availableUpgrade;
        const reportedHash = upgrade.hash;
        const actualHash = await hasha.fromFile(upgrade.filepath, {
          algorithm: "sha256",
        });
        const expectedHash = await hasha.fromFile(
          path.join(validApksFolder, device2Plan.config.currentApk),
          { algorithm: "sha256" }
        );
        t.equal(
          reportedHash,
          expectedHash,
          "Downloaded reported expected hash"
        );
        t.equal(
          actualHash,
          expectedHash,
          "Downloaded file matches expected hash"
        );
      },
    ],
  };

  /** @type {DevicePlan} */
  const device2Plan = {
    label: "device2",
    config: {
      currentApk: "com.example.test_SDK21_VN1.1.0_VC1.apk",
      deviceInfo: defaultDeviceInfo,
      autoStart: true,
    },
    steps: [
      {
        eventName: "state",
        waitFor: { value: "started" },
      },
      {
        message: "current apk from device is uploading",
        eventName: "state",
        waitFor: {
          uploads: [
            {
              id:
                // Hash of the currentApk on this device
                "550f1eec073f07dad4c507ff339a48be895a450110874e8f3b87d572e6368307",
            },
          ],
        },
      },
      {
        message: "upload is complete",
        eventName: "state",
        waitFor: {
          uploads: [],
        },
      },
    ],
  };

  const cleanUpFunctions = await Promise.all([
    playDevicePlan(t, device1Plan),
    playDevicePlan(t, device2Plan),
  ]);

  t.pass("Scenario complete without error");

  await Promise.all(cleanUpFunctions.map(f => f()));
});

test("One device updates multiple other devices", async t => {
  /** @type {DevicePlan} */
  const deviceWithNewerMapeoPlan = {
    label: "v1.1.0",
    config: {
      currentApk: "com.example.test_SDK21_VN1.1.0_VC1.apk",
      deviceInfo: defaultDeviceInfo,
      autoStart: true,
    },
    steps: [
      {
        eventName: "state",
        waitFor: { value: "started" },
      },
      {
        message: "current apk from device is uploading",
        eventName: "state",
        waitFor: {
          // Expect at least one upload - no guarantee all uploads will happen
          // at the same time
          uploads: [{}],
        },
      },
      {
        message: "upload is complete",
        eventName: "state",
        waitFor: {
          uploads: [],
        },
      },
    ],
  };

  /** @type {DevicePlan} */
  const deviceWithOlderMapeoPlan = {
    label: "replaced in map below",
    config: {
      currentApk: "com.example.test_SDK21_VN1.0.0_VC1.apk",
      deviceInfo: defaultDeviceInfo,
      autoStart: true,
    },
    steps: [
      {
        eventName: "state",
        waitFor: { value: "started" },
      },
      {
        message: "download of update started",
        eventName: "state",
        waitFor: {
          downloads: [
            {
              id:
                // Expected hash of update on newer device
                "550f1eec073f07dad4c507ff339a48be895a450110874e8f3b87d572e6368307",
            },
          ],
        },
        never: {
          // Uploads should never be uploading
          uploads: [{}],
        },
      },
      {
        message: "update is downloaded and available",
        eventName: "state",
        waitFor: {
          downloads: [],
          availableUpgrade: "com.example.test_SDK21_VN1.1.0_VC1.expected.json",
        },
        never: {
          // Uploads should never be uploading
          uploads: [{}],
        },
      },
    ],
  };

  const olderDevicePlans = new Array(5)
    .fill(deviceWithOlderMapeoPlan)
    .map((p, i) => ({ ...p, label: "device" + i }));

  const cleanUpFunctions = await Promise.all([
    playDevicePlan(t, deviceWithNewerMapeoPlan),
    ...olderDevicePlans.map(p => playDevicePlan(t, p)),
  ]);

  t.pass("Scenario complete without error");

  await Promise.all(cleanUpFunctions.map(f => f()));
});

test("Update is passed from device to device", async t => {
  // This device starts with the newer APK
  /** @type {DevicePlan} */
  const device1Plan = {
    label: "device1",
    config: {
      currentApk: "com.example.test_SDK21_VN1.1.0_VC1.apk",
      deviceInfo: defaultDeviceInfo,
      autoStart: true,
    },
    steps: [
      {
        eventName: "state",
        waitFor: { value: "started" },
      },
      {
        message: "upload started",
        eventName: "state",
        waitFor: {
          uploads: [{}],
        },
      },
      {
        message: "upload complete",
        eventName: "state",
        waitFor: {
          uploads: [],
        },
      },
    ],
  };

  // Device starts with older APK, downloads newer one, then uploads newer APK
  // to other device when it comes online
  /** @type {DevicePlan} */
  const device2Plan = {
    label: "device2",
    config: {
      currentApk: "com.example.test_SDK21_VN1.0.0_VC1.apk",
      deviceInfo: defaultDeviceInfo,
      autoStart: true,
    },
    steps: [
      {
        eventName: "state",
        waitFor: { value: "started" },
      },
      {
        message: "download of update started",
        eventName: "state",
        waitFor: {
          downloads: [
            {
              id:
                // Expected hash of update on newer device
                "550f1eec073f07dad4c507ff339a48be895a450110874e8f3b87d572e6368307",
            },
          ],
        },
        never: {
          // Uploads should never be uploading
          uploads: [{}],
        },
      },
      {
        message: "update is downloaded and available",
        eventName: "state",
        waitFor: {
          downloads: [],
          availableUpgrade: "com.example.test_SDK21_VN1.1.0_VC1.expected.json",
        },
        never: {
          // Uploads should never be uploading
          uploads: [{}],
        },
      },

      {
        message: "upload of update started",
        eventName: "state",
        waitFor: {
          uploads: [
            {
              id:
                // Expected hash of update on newer device
                "550f1eec073f07dad4c507ff339a48be895a450110874e8f3b87d572e6368307",
            },
          ],
        },
      },
      {
        message: "upload complete",
        eventName: "state",
        waitFor: {
          uploads: [],
        },
      },
    ],
  };

  // Device comes online after device1 goes offline, and downloads from device2
  /** @type {DevicePlan} */
  const device3Plan = {
    label: "device3",
    config: {
      currentApk: "com.example.test_SDK21_VN1.0.0_VC1.apk",
      deviceInfo: defaultDeviceInfo,
      autoStart: true,
    },
    steps: [
      {
        eventName: "state",
        waitFor: { value: "started" },
      },
      {
        message: "download of update started",
        eventName: "state",
        waitFor: {
          downloads: [
            {
              id:
                // Expected hash of update on newer device
                "550f1eec073f07dad4c507ff339a48be895a450110874e8f3b87d572e6368307",
            },
          ],
        },
        never: {
          // Uploads should never be uploading
          uploads: [{}],
        },
      },
      {
        message: "update is downloaded and available",
        eventName: "state",
        waitFor: {
          downloads: [],
          availableUpgrade: "com.example.test_SDK21_VN1.1.0_VC1.expected.json",
        },
        never: {
          // Uploads should never be uploading
          uploads: [{}],
        },
      },
    ],
  };

  const device1Promise = playDevicePlan(t, device1Plan);
  const device2Promise = playDevicePlan(t, device2Plan);

  // Stop and cleanup device 1
  const cleanup1 = await device1Promise;
  await cleanup1();

  t.pass("device1 is stopped");

  // Now play device3 plan and wait for device2 plan to finish
  const cleanUpFunctions = await Promise.all([
    device2Promise,
    playDevicePlan(t, device3Plan),
  ]);

  t.pass("Scenario complete without error");

  await Promise.all(cleanUpFunctions.map(f => f()));
});
