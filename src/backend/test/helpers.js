// @ts-check
const { promises: fsPromises } = require("fs");
const path = require("path");
const tmp = require("tmp-promise");
const Storage = require("../lib/upgrade-storage");
const UpgradeManager = require("../lib/upgrade-manager");
const isMatch = require("lodash/isMatch");
const log = require("debug")("p2p-upgrades:testHelpers");

/** @typedef {import('../lib/types').InstallerInt} InstallerInt */
/** @typedef {import('../lib/types').InstallerExt} InstallerExt */
/** @typedef {import('../lib/types').DeviceInfo} DeviceInfo */
/** @typedef {import('../lib/types').DevicePlan} DevicePlan */
module.exports = {
  readJson,
  hashCmp,
  setupStorage,
  setupTmpStorageFolder,
  playDevicePlan,
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

const validApksFolder = path.join(__dirname, "./fixtures/valid-apks");

/**
 * Create an UpgradeManager instance and create a temporary dir for storageDir,
 * optionally initializing the storage with a list of APKs
 *
 * @param {import('../lib/types').ManagerOptions} options
 */
async function createManager({ apkFiles = [], currentApk, deviceInfo }) {
  const filepaths = apkFiles.map(f => path.join(validApksFolder, f));
  const currentApkFilepath = path.join(validApksFolder, currentApk);
  const currentApkInfo = {
    ...(await readJson(currentApkFilepath.replace(/\.apk$/, ".expected.json"))),
    filepath: currentApkFilepath,
  };
  const { storageDir, cleanup } = await setupTmpStorageFolder(
    filepaths,
    currentApkInfo
  );

  return {
    manager: new UpgradeManager({ storageDir, currentApkInfo, deviceInfo }),
    cleanup,
  };
}

/**
 * Listen to an event `eventName` until it returns `expectedValue`. Throws if
 * `timeout` is reached before an event is emitted with `expectedValue`.
 * `expectedValue` is checked against the value emitted by a partial match,
 * using the lodaash `isMatch` function. This will ignore any undefined
 * properties on `expectedValue` when comparing the value returned by the event
 * emitter.
 *
 * @template {object} T
 * @param {import('tiny-typed-emitter').TypedEmitter} emitter
 * @param {string} eventName Name of event to await
 * @param {T} expectedValue Promise will resolve once the emitted event partially matches this expected value
 * @param {object} [options]
 * @param {number} [options.timeout=10000] After timeout, if `expectedValue` has not been emitted, the promise will timeout
 * @param {string} [options.name=""]
 * @param {import('type-fest').PartialDeep<T>} [options.always] Every event emitted whilst waiting for `expectedValue` should match this value
 * @param {import('type-fest').PartialDeep<T>} [options.never] If any event emitted whilst waiting for `expectedValue`, promise will throw
 * @returns {Promise<void>}
 */
async function onceEventResult(
  emitter,
  eventName,
  expectedValue,
  { timeout = 10000, always, never, name = "" } = {}
) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      onError(
        new Error(
          `${name}: Timeout waiting for emitted value ${JSON.stringify(
            expectedValue
          )}`
        )
      );
    }, timeout);
    emitter.on(eventName, checkValue);

    function onError(/** @type {Error} */ error) {
      emitter.off(eventName, checkValue);
      reject(error);
    }

    /** @param {T} value */
    function checkValue(value) {
      log(`${name}:`, value);
      if (never && isMatch(value, never)) {
        return onError(
          new Error(
            `${name}: Event '${eventName}' emitted value ${JSON.stringify(
              value
            )} matches ${JSON.stringify(never)}`
          )
        );
      }
      if (always && !isMatch(value, always)) {
        return onError(
          new Error(
            `${name}: Event '${eventName}' emitted value ${JSON.stringify(
              value
            )} does not match ${JSON.stringify(always)}`
          )
        );
      }
      if (!isMatch(value, expectedValue)) return;
      clearTimeout(timeoutId);
      emitter.off(eventName, checkValue);
      resolve();
    }
  });
}

/**
 * Play a device plan from start to finish. Will throw if any test fails.
 *
 * @param {import('tape').Test} t
 * @param {DevicePlan} devicePlan
 */
async function playDevicePlan(
  t,
  { label, config: { autoStart = false, ...managerOptions }, steps }
) {
  const { manager, cleanup } = await createManager(managerOptions);
  // Don't await start here - device plan implementer can choose to do that
  if (autoStart) manager.start();
  for (const step of steps) {
    if (typeof step === "function") {
      await step(manager);
    } else {
      // Sorry for ugliness! To save writing out apkInfo for availableUpgrades,
      // we just pass in a filename of a JSON file describing this. This code
      // reads the JSON and replaces the value `availableUpgrade`
      const normalizedStep = { ...step };
      for (const key of ["waitFor", "always", "never"]) {
        // @ts-ignore
        const value = step[key];
        if (value) {
          // @ts-ignore
          normalizedStep[key] = { ...value };
        }
        if (value && typeof value.availableUpgrade === "string") {
          // @ts-ignore
          normalizedStep[
            key
          ].availableUpgrade = /** @type {InstallerInt} */ (await readJson(
            path.join(validApksFolder, value.availableUpgrade)
          ));
        }
      }
      const { eventName, waitFor, ...options } = normalizedStep;
      await onceEventResult(manager, eventName, waitFor, {
        ...options,
        name: label,
      });
      const message = step.message
        ? `${label}: ${step.message}`
        : `${label} emitted event '${eventName}' with value ${JSON.stringify(
            waitFor
          )}`;
      t.pass(message);
    }
  }

  return async function stopAndCleanup() {
    await manager.stop();
    await cleanup();
  };
}
