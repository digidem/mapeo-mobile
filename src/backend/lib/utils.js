// @ts-check
const semver = require("semver");
const hasha = require("hasha");
const path = require("path");
const fs = require("fs");
const stream = require("stream");
const { promisify } = require("util");
const { once } = require("events");
const pDefer = require("p-defer");
const copyError = require("utils-copy-error");
const ApkParser = require("app-info-parser/src/apk");
const ZipFs = require("@gmaclennan/zip-fs");
const log = require("debug")("p2p-upgrades:utils");

/** @typedef {import('./types').InstallerInt} InstallerInt */
/** @typedef {import('./types').InstallerExt} InstallerExt */

module.exports = {
  installerCompare,
  isUpgradeCandidate,
  getBestUpgradeCandidate,
  getInstallerInfo,
  beforeAfterStream,
  stringifyInstaller,
};

/**
 * Check if pre-release is valid
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function isValidPreRelease(a, b) {
  const validA = semver.valid(a);
  const validB = semver.valid(b);
  if (!validA || !validB) return false;
  const validAPR = semver.parse(validA);
  const validBPR = semver.parse(validB);
  if (!validAPR || !validBPR) return false;
  const APR = validAPR.prerelease[0];
  const BPR = validBPR.prerelease[0];
  if (!APR || !BPR) return true;
  if (typeof APR !== "string" || typeof BPR !== "string") return false;
  if (APR.startsWith("PR") && BPR.startsWith("PR")) {
    if (APR === BPR) return true;
    else {
      log(`installer rejected: PR ${APR} is different to ${BPR}`);
      return false;
    }
  }
  if (APR.startsWith("RC") && BPR.startsWith("RC")) {
    if (a.split("-")[0] === b.split("-")[0]) return true;
    else {
      log(`installer rejected: RC ${a} has different versioning then ${b}`);
      return false;
    }
  }
  return true;
}

/**
 * Compare two installer options, returns -1 if a is less than b, 0 if same, 1
 * if a is greater than b
 *
 * @param {InstallerInt | InstallerExt} a
 * @param {InstallerInt | InstallerExt} b
 * @returns {-1 | 0 | 1}
 */
function installerCompare(a, b) {
  const aIsValidSemver = semver.valid(a.versionName);
  const bIsValidSemver = semver.valid(b.versionName);
  if (!aIsValidSemver && !bIsValidSemver) return 0;
  if (!aIsValidSemver) {
    log(`installer rejected: ${aIsValidSemver} is invalid semver`);
    return -1;
  }
  if (!bIsValidSemver) return 1;
  // Important to validate semver before here, otherwise this will throw
  const semverCompare = semver.compare(a.versionName, b.versionName);
  if (semverCompare !== 0) {
    log("semverCompare:", semverCompare);
    return semverCompare;
  }
  if (a.versionCode < b.versionCode) {
    log(`installer rejected: ${a.versionCode} < ${b.versionCode}`);
    return -1;
  }
  if (a.versionCode > b.versionCode) return 1;
  return 0;
}

/**
 * Check if an installer is compatible with the given device. Requirements:
 *
 * 1. Must support arch of device
 * 2. Must support SDK of device
 * 3. Version code must be greater or equal to currently installed app
 * 4. Installer must be for platform 'android'
 * 5. applicationId must match applicationId of currently installed app
 * 6. versionName must be valid semver
 *
 * @param {object} options
 * @param {import('./types').DeviceInfo} options.deviceInfo
 * @param {InstallerInt | InstallerExt} options.installer
 * @param {InstallerInt | InstallerExt} options.currentApkInfo
 * @returns {boolean}
 */
function isUpgradeCandidate({ deviceInfo, installer, currentApkInfo }) {
  // Filter out the current APK
  if (installer.hash === currentApkInfo.hash) return false;
  // Check for 0 or less APK size
  if (installer.size <= 0) return false;
  // TODO: 64 bit devices can run 32 bit APKs
  const isSupportedAbi = installer.arch.some(arch =>
    deviceInfo.supportedAbis.includes(arch)
  );
  if (!isSupportedAbi) return false;
  if (installer.minSdkVersion > deviceInfo.sdkVersion) {
    log(
      `installer rejected: minSdkVersion ${installer.minSdkVersion} is not supported by this device`
    );
    return false;
  }
  if (installer.applicationId !== currentApkInfo.applicationId) {
    log(
      `installer rejected: application id ${installer.applicationId} doesn't match ${currentApkInfo.applicationId}`
    );
    return false;
  }
  if (installer.platform !== "android") {
    log(`installer rejected: platform isn't Android`);
    return false;
  }
  if (installer.versionCode < currentApkInfo.versionCode) {
    log(
      `installer rejected: installer version code ${installer.versionCode} is lower then current: ${currentApkInfo.versionCode} `
    );
    return false;
  }

  if (!semver.valid(installer.versionName)) {
    log(
      `installer rejected: semver ${installer.versionName} is invalid:`,
      semver.valid(installer.versionName)
    );
    return false;
  }
  // Check if is PR and is the same
  const preReleaseCheck = isValidPreRelease(
    installer.versionName,
    currentApkInfo.versionName
  );
  if (!preReleaseCheck) {
    log(
      `installer rejected: Pre-release ${installer.versionName} not compatible with ${currentApkInfo.versionName}`
    );
    return false;
  }
  if (installerCompare(installer, currentApkInfo) < 1) {
    log(
      "installer rejected: comparisson between installer and current apk failed:",
      installerCompare(installer, currentApkInfo)
    );
    return false;
  }
  // TODO: Check for internal and release candidate builds e.g. a release
  // candidate is only an upgrade candidate if the current apk is a release
  // candidate
  return true;
}

/**
 * From a list of installers, return the most recent compatible upgrade (if
 * there is one)
 *
 * @template {InstallerInt | InstallerExt} T
 * @param {object} options
 * @param {import('./types').DeviceInfo} options.deviceInfo
 * @param {Array<T>} options.installers
 * @param {InstallerInt} options.currentApkInfo
 * @returns {T}
 */
function getBestUpgradeCandidate({ deviceInfo, installers, currentApkInfo }) {
  const upgradeCandidates = installers.filter(installer =>
    isUpgradeCandidate({
      installer,
      currentApkInfo,
      deviceInfo,
    })
  );
  return upgradeCandidates.sort(installerCompare).reverse()[0];
}

/**
 * For a given filepath to an APK, get the UpgradeOption details
 *
 * @param {string} filepath
 * @returns {Promise<InstallerInt>}
 */
async function getInstallerInfo(filepath) {
  if (path.extname(filepath) !== ".apk")
    throw new Error(`${filepath} is not an .apk file`);
  const [
    hash,
    stat,
    { versionName, versionCode, applicationId, arch, minSdkVersion },
  ] = await Promise.all([
    hasha.fromFile(filepath, { algorithm: "sha256" }),
    fs.promises.stat(filepath),
    getApkMetadata(filepath),
  ]);
  return {
    hash,
    hashType: "sha256",
    versionName,
    versionCode,
    applicationId,
    platform: "android",
    arch,
    size: stat.size,
    minSdkVersion,
    filepath,
  };
}

/**
 * Get version name, version code & applicationId from an apk file
 *
 * @param {string} filepath path to apk
 * @returns {Promise<Pick<InstallerInt, 'versionName' | 'versionCode' | 'applicationId' | 'arch' | 'minSdkVersion'>>}
 */
async function getApkMetadata(filepath) {
  const parser = new ApkParser(filepath);
  const [result, arch] = await Promise.all([
    parser.parse(),
    getApkAbis(filepath),
  ]);
  return {
    versionName: result.versionName,
    versionCode: result.versionCode,
    applicationId: result.package,
    arch,
    minSdkVersion: (result.usesSdk || {}).minSdkVersion || 1,
  };
}

// If an APK does not have native code (e.g. no `lib` folder) then we assume it runs on these ABIs
/** @type {InstallerInt['arch']} */
const DEFAULT_ABIS = ["armeabi-v7a", "arm64-v8a", "x86", "x86_64"];

/**
 * Get the ABIs supported by an APK
 *
 * @param {string} filepath
 * @returns {Promise<InstallerInt['arch']>}
 */
async function getApkAbis(filepath) {
  const zip = new ZipFs(filepath);
  /** @type {InstallerInt['arch']} */
  const libDirs = (await promisify(zip.readdir.bind(zip))("lib")).filter((
    /** @type {string} */ name
  ) =>
    DEFAULT_ABIS.includes(
      // @ts-ignore - this one is a pain to type correctly!
      name
    )
  );
  await promisify(zip.close.bind(zip))();
  return libDirs.length ? libDirs : DEFAULT_ABIS.slice(0);
}

/**
 * Wrap an asynchronously created writable stream with another writable stream,
 * which will run a flush function _after_ the wrapped stream has already
 * finished, but before the returned stream will finish.
 *
 * Useful if you want to synchronously return a stream, then asynchronously
 * create a write stream, then do some work after the internal stream has
 * finished writing (e.g. move a file) before the returned stream finishes.
 *
 * @param {object} options
 * @param {() => Promise<stream.Writable>} options.createStream
 * @param {(wrappedStream: stream.Writable) => Promise<void>} options.finalize
 * @returns {stream.Writable}
 */
function beforeAfterStream({ createStream, finalize }) {
  /** @type {stream.Writable | void} */
  let wrappedStream;
  /** @type {import('p-defer').DeferredPromise<stream.Writable>} */
  const deferred = pDefer();

  // Avoid unhandled error if deferred is rejected before writev() is called
  deferred.promise.catch(() => {});

  // Need to use a deferred promise to work around error handling for race
  // conditions if createStream throws before the first _writev() call, or if it
  // throws within the writev call
  createStream()
    .then(str => {
      wrappedStream = str;
      wrappedStream.once("error", e => {
        // If this error comes from ws.destroy(), don't re-emit it, because ws
        // will already have emitted an error event for destroy
        // @ts-ignore
        if (e.__fromDestroy) return;
        ws.emit("error", e);
      });
      deferred.resolve(str);
    })
    .catch(e => {
      deferred.reject(e);
    });

  const ws = new stream.Writable({
    // Use writev vs write to support backpressure between streams
    async writev(chunks, cb) {
      try {
        // Avoid an extra tick for each write by only awaiting once
        if (!wrappedStream) wrappedStream = await deferred.promise;
        for (const { chunk } of chunks) {
          const ok = wrappedStream.write(chunk);
          if (!ok) await once(wrappedStream, "drain");
        }
        cb();
      } catch (e) {
        // Don't bubble up destroy errors a second time
        cb(e.__fromDestroy ? null : e);
      }
    },
    async final(cb) {
      try {
        if (!wrappedStream) wrappedStream = await deferred.promise;
        await promisify(wrappedStream.end.bind(wrappedStream))();
        await finalize(wrappedStream);
        cb();
      } catch (e) {
        // Don't bubble up destroy errors a second time
        cb(e.__fromDestroy ? null : e);
      }
    },
    async destroy(e, cb) {
      // If destroy() happens before wrapped stream is created, we still expect
      // the wrapped stream to be destroyed, so we wait for it
      if (!wrappedStream) wrappedStream = await deferred.promise;
      let wrappedError;
      // This error from destroy() must not be re-emitted on the outer stream
      // (because destroy will automatically emit an error), so we add a
      // hidden property so we can catch it
      if (e) {
        wrappedError = copyError(e);
        // @ts-ignore
        wrappedError.__fromDestroy = true;
      }
      wrappedStream.destroy(wrappedError);
      cb(e);
    },
  });

  return ws;
}

const shortAbiNames = {
  "armeabi-v7a": "arm7",
  "arm64-v8a": "arm64",
  x86: "x86",
  x86_64: "x64",
};

/**
 * Stringify relevant data about an installer for logging, to make logs easier
 * to read (avoiding large objects)
 *
 * @param {InstallerExt | InstallerInt} installer
 * @returns {string}
 */
function stringifyInstaller({
  applicationId,
  minSdkVersion,
  versionName,
  versionCode,
  arch,
  hash,
}) {
  return `${applicationId}_SDK${minSdkVersion}_VN${versionName}_VC${versionCode}_${arch
    .map(a => shortAbiNames[a])
    .join(",")}_${hash.slice(0, 7)}`;
}
