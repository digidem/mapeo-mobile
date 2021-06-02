/* eslint-disable promise/param-names */
// @ts-check
const test = require("tape");
const path = require("path");
const { playDevicePlan, validApksFolder } = require("./helpers");
const hasha = require("hasha");
const got = require("got").default;
const Agent = require("agentkeepalive");
const pDefer = require("p-defer");

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

test.only("Update is passed from device to device", async t => {
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

test("Checking another device for updates re-uses the same connection (keep-alive)", async t => {
  let connectionCount = 0;
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

  /** @type {DevicePlan} */
  const device2Plan = {
    label: "device2",
    config: {
      currentApk: "com.example.test_SDK21_VN1.1.0_VC1.apk",
      deviceInfo: defaultDeviceInfo,
      autoStart: false,
    },
    steps: [
      async manager => {
        // Count each connection to the server (from device1). We wait 10
        // seconds at the end of this test to allow for device1 to make several
        // requests to `/installers`, so we can check they are using the same
        // single connection
        manager.httpServer.on("connection", () => connectionCount++);
        return manager.start();
      },
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

  t.pass("Waiting 10 seconds polling of `/installers`");
  await new Promise(res => setTimeout(res, 10000));

  t.equal(connectionCount, 1, "All requests re-used same connection");

  await Promise.all(cleanUpFunctions.map(f => f()));
});

// Why this test? Polling the server on a keep-alive connection can prevent it
// from ever closing (because the sockets will remain open). We have an
// "onRequest" hook in upgrade-server that ensures that as soon as the server
// starts closing, all routes respond with 503, and open connections receive a
// `Connection: close` header, which tells the keep-alive agent to stop. This
// test polls the server 4 times during and after stopping, and checks that it
// can close successfully. Without the "onRequest" hook, this test fails.
test("Device is able to close when being polled with keep-alive", async t => {
  const keepaliveAgent = new Agent();
  const deferred = pDefer();

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
      async manager => {
        // @ts-ignore
        const { address, port } = manager.httpServer.address();
        let pollCount = 0;
        await pollServer();
        async function pollServer() {
          if (pollCount++ > 3) return deferred.resolve();
          try {
            await got(`http://${address}:${port}/installers`, {
              agent: { http: keepaliveAgent },
            });
            t.equal(
              pollCount,
              1,
              "Only first poll of server works without error"
            );
          } catch (e) {
            t.ok(pollCount > 1, "Subsequent polls should throw");
          }
          await new Promise(res => setTimeout(res, 1000));
          pollServer();
        }
      },
      async manager => {
        manager.stop();
      },
      {
        eventName: "state",
        waitFor: { value: "stopped" },
        timeout: 2000,
      },
    ],
  };

  const cleanup = await playDevicePlan(t, device1Plan);
  await deferred.promise;

  t.pass("Scenario complete without error");

  await cleanup();
});

test("Closing a device whilst sharing an update waits for upload to complete", async t => {
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
        message: "update is downloaded and available",
        eventName: "state",
        waitFor: {
          downloads: [],
          availableUpgrade: "com.example.test_SDK21_VN1.1.0_VC1.expected.json",
        },
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
          uploads: [{}],
        },
      },
      async manager => {
        manager.stop();
      },
      {
        eventName: "state",
        waitFor: {
          value: "stopping",
        },
      },
      {
        message: "stopped and upload complete",
        eventName: "state",
        waitFor: {
          value: "stopped",
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

test("Broken connection during download does not crash server", async t => {
  /** @type {import('net').Socket} */
  let activeSocket;

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
        message: "download started",
        eventName: "state",
        waitFor: {
          downloads: [{}],
        },
      },
      {
        message: "download cancelled",
        eventName: "state",
        waitFor: {
          downloads: [],
          availableUpgrade: undefined,
        },
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
      async manager => {
        manager.httpServer.on("connection", socket => {
          activeSocket = socket;
        });
      },
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
      async () => {
        activeSocket.destroy();
      },
      {
        message: "upload cancelled",
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

test("Lifecycle events: 'starting', 'started', 'stopping', 'stopped'", async t => {
  /** @type {DevicePlan} */
  const device1Plan = {
    label: "device1",
    config: {
      currentApk: "com.example.test_SDK21_VN1.0.0_VC1.apk",
      deviceInfo: defaultDeviceInfo,
      autoStart: false,
    },
    steps: [
      async manager => {
        // Start on next tick so the "starting" state event happens after we
        // start listening for it
        process.nextTick(() => {
          manager.start();
        });
      },
      {
        eventName: "state",
        waitFor: { value: "starting" },
      },
      {
        eventName: "state",
        waitFor: { value: "started" },
      },
      async manager => {
        process.nextTick(() => {
          manager.stop();
        });
      },
      {
        eventName: "state",
        waitFor: { value: "stopping" },
      },
      {
        eventName: "state",
        waitFor: { value: "stopped" },
      },
    ],
  };

  const cleanup = await playDevicePlan(t, device1Plan);
  t.pass("Scenario complete without error");
  await cleanup();
});
