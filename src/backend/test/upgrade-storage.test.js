// @ts-check

const path = require("path");
const tmp = require("tmp-promise");
const test = require("tape");
const Storage = require("../lib/upgrade-storage");
const fs = require("fs");
const mkdirp = require("mkdirp");
const { once } = require("events");
const stream = require("stream");
const { promisify } = require("util");
const pipeline = promisify(stream.pipeline);

const fsPromises = fs.promises;

/** @typedef {import('../lib/types').InstallerInt} InstallerInt */

tmp.setGracefulCleanup();

const validApksFolder = path.join(__dirname, "./fixtures/valid-apks");
const invalidApksFolder = path.join(__dirname, "./fixtures/invalid-apks");

/**
 * @param {string[]} filepaths List of files to copy into temp directory
 * @param {InstallerInt} currentApkInfo
 */
async function setupStorage(filepaths, currentApkInfo) {
  const tmpDir = await tmp.dir({ unsafeCleanup: true });
  const expected = [];
  for (const filepath of filepaths) {
    const dstFilepath = path.join(tmpDir.path, path.basename(filepath));
    await fsPromises.copyFile(filepath, dstFilepath);
    expected.push({
      ...(await readJson(filepath.replace(/\.apk$/, ".expected.json"))),
      filepath: dstFilepath,
    });
  }
  expected.push(currentApkInfo);
  return {
    expected,
    storage: new Storage({
      storageDir: tmpDir.path,
      currentApkInfo,
    }),
    cleanup: tmpDir.cleanup,
    storageDir: tmpDir.path,
  };
}

/** @type {InstallerInt} */
const FAKE_APK_INFO_MIN = {
  hash: "810ff2fb242a5dee4220f2cb0e6a519891fb67f2f828a6cab4ef8894633b1f50",
  size: 8,
  versionName: "0.0.1",
  minSdkVersion: 1,
  applicationId: "com.example",
  versionCode: 1,
  hashType: "sha256",
  platform: "android",
  arch: ["arm64-v8a"],
  filepath: "non-existent.apk",
};

/** @type {InstallerInt} */
const FAKE_APK_INFO_V2 = {
  hash: "810ff2fb242a5dee4220f2cb0e6a519891fb67f2f828a6cab4ef8894633b1f50",
  size: 8,
  versionName: "2.0.0",
  minSdkVersion: 1,
  applicationId: "com.example",
  versionCode: 1,
  hashType: "sha256",
  platform: "android",
  arch: ["arm64-v8a"],
  filepath: "non-existent.apk",
};

test("emits list of installers on startup", async t => {
  const testApkFilenames = ["com.example.test_minSdk21_VN1.0.0_VC1.apk"];
  const filepaths = testApkFilenames.map(filename =>
    path.join(validApksFolder, filename)
  );
  const { storage, expected, cleanup } = await setupStorage(
    filepaths,
    FAKE_APK_INFO_MIN
  );

  const [installers] = await once(storage, "installers");

  t.deepEqual(installers.sort(hashCmp), expected.sort(hashCmp));

  await cleanup();
});

test("list() returns info about installers in storage and the current APK", async t => {
  const testApkFilenames = ["com.example.test_minSdk21_VN1.0.0_VC1.apk"];
  const filepaths = testApkFilenames.map(filename =>
    path.join(validApksFolder, filename)
  );
  const { storage, expected, cleanup } = await setupStorage(
    filepaths,
    FAKE_APK_INFO_MIN
  );

  const installers = await storage.list();

  t.deepEqual(installers.sort(hashCmp), expected.sort(hashCmp));

  await cleanup();
});

test("get() returns info about installers referenced by hash", async t => {
  const { storage, cleanup } = await setupStorage([], FAKE_APK_INFO_MIN);

  const installer = await storage.get(FAKE_APK_INFO_MIN.hash);

  t.deepEqual(installer, FAKE_APK_INFO_MIN);

  await cleanup();
});

test("get() returns undefined if no APK with given hash exists", async t => {
  const { storage, cleanup } = await setupStorage([], FAKE_APK_INFO_MIN);

  const installer = await storage.get("non-existent-hash");

  t.ok(typeof installer === "undefined");

  await cleanup();
});

test("Older APKs are deleted after initialization", async t => {
  // Start with only older APKs
  const testApkFilenames = ["com.example.test_minSdk21_VN1.0.0_VC1.apk"];
  const filepaths = testApkFilenames.map(filename =>
    path.join(validApksFolder, filename)
  );
  const { storage, storageDir, cleanup } = await setupStorage(
    filepaths,
    FAKE_APK_INFO_V2
  );

  const installers = await storage.list();

  t.equal(installers.length, 1, "Only one installer now");
  t.equal(
    installers[0].hash === FAKE_APK_INFO_V2.hash,
    "The only installer is own APK"
  );
  t.deepEqual(
    await fsPromises.readdir(storageDir),
    ["tmp"],
    "Storage dir is empty (apart from tmp folder)"
  );

  await cleanup();
});

test.only("createWriteStream() --> new APK appears as an available installer", async t => {
  const { storage, cleanup, storageDir } = await setupStorage(
    [],
    FAKE_APK_INFO_MIN
  );

  // Check both list() and "installers" event
  const [installersFromList, [installersFromEvent]] = await Promise.all([
    storage.list(),
    once(storage, "installers"),
  ]);

  t.deepEqual(
    installersFromList,
    [FAKE_APK_INFO_MIN],
    "Starts with only current apk"
  );
  t.deepEqual(
    installersFromEvent,
    [FAKE_APK_INFO_MIN],
    "Starts with only current apk"
  );

  const testApkFilepath = path.join(
    validApksFolder,
    "com.example.test_minSdk21_VN1.0.0_VC1.apk"
  );
  const expected = await readJson(
    testApkFilepath.replace(/\.apk/, ".expected.json")
  );
  const ws = storage.createWriteStream({ hash: expected.hash });

  // Attach listener before we await the pipeline
  const installersEmitPromise = once(storage, "installers");
  await pipeline(fs.createReadStream(testApkFilepath), ws);

  t.ok(
    fs.readdirSync(storageDir).includes(expected.hash + ".apk"),
    "File is immediately available after writeStream finish"
  );

  // Check both list() and "installers" event
  const [installersFromList2, [installersFromEvent2]] = await Promise.all([
    storage.list(),
    installersEmitPromise,
  ]);

  t.ok(
    installersFromList2.map(i => i.hash).includes(expected.hash),
    "File is available from list()"
  );
  t.ok(
    installersFromEvent2.map(i => i.hash).includes(expected.hash),
    "File is available from list()"
  );

  await cleanup();
});

test("A failed write does not appear as an upgrade option", async t => {
  const { storage, cleanup } = await setupStorage([], FAKE_APK_INFO_MIN);

  t.deepEqual(
    await storage.list(),
    [FAKE_APK_INFO_MIN],
    "Starts with only current apk"
  );

  const ws = storage.createWriteStream({ hash: "anything" });
  try {
    await pipeline(fs.createReadStream("non-existent-file.apk"), ws);
  } catch (e) {
    t.ok(e instanceof Error, "throws an error");
  }

  t.deepEqual(
    await storage.list(),
    [FAKE_APK_INFO_MIN],
    "Still lists only current APK"
  );

  await cleanup();
});

test("createWriteStream() --> invalid hash = installer does not appear as option", async t => {
  const { storage, cleanup } = await setupStorage([], FAKE_APK_INFO_MIN);

  t.deepEqual(
    await storage.list(),
    [FAKE_APK_INFO_MIN],
    "Starts with only current apk"
  );

  const testApkFilepath = path.join(
    validApksFolder,
    "com.example.test_minSdk21_VN1.0.0_VC1.apk"
  );
  const ws = storage.createWriteStream({ hash: "invalid-hash" });
  try {
    await pipeline(fs.createReadStream(testApkFilepath), ws);
  } catch (e) {
    t.ok(e instanceof Error, "writeStream throws");
  }

  t.deepEqual(
    await storage.list(),
    [FAKE_APK_INFO_MIN],
    "Installer with invalid hash does not appear as an option"
  );

  await cleanup();
});

test("leftover files in the upgrade temp dir get wiped on init", async t => {
  const { path: storageDir } = await tmp.dir();
  await mkdirp(path.join(storageDir, "tmp"));
  const filepath = path.join(storageDir, "tmp", "somefile");
  await fsPromises.writeFile(filepath, Buffer.alloc(16));

  t.ok(fs.existsSync(filepath), "file created ok");

  const storage = new Storage({
    storageDir,
    currentApkInfo: FAKE_APK_INFO_MIN,
  });
  await storage.started();

  t.notOk(fs.existsSync(filepath), "file does not exist");
});

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
