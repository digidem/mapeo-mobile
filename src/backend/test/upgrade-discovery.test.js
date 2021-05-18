// @ts-check
const test = require("tape");
const path = require("path");
const getPort = require("get-port");
const { once } = require("events");
const { setupStorage } = require("./helpers.js");
const Discovery = require("../lib/upgrade-discovery");
const Server = require("../lib/upgrade-server");
const fakeApkInfo = require("./fixtures/fake-apk-info");

const validApksFolder = path.join(__dirname, "./fixtures/valid-apks");

/**
 * @param {string[]} apkFilenames List of filenames to copy into temp directory
 * @param {import("../lib/types").InstallerInt} currentApkInfo
 */
async function startDiscovery(apkFilenames, currentApkInfo) {
  const filepaths = apkFilenames.map(filename =>
    path.join(validApksFolder, filename)
  );
  const { storage, expected, cleanup } = await setupStorage(
    filepaths,
    fakeApkInfo.v0_0_1
  );
  const discovery = new Discovery({ storage, discoveryKey: "com.mapeo" });
  const server = new Server({ storage });
  const port = await getPort();
  return {
    discovery,
    expected,
    port,
    start: async () => {
      await Promise.all([discovery.start(port), server.start(port)]);
    },
    cleanup: async () => {
      await Promise.all([discovery.stop(), server.stop(), cleanup()]);
    },
  };
}

test("Discovery finds peer and emits available installers", async t => {
  const testApkFilenames1 = ["com.example.test_minSdk21_VN1.0.0_VC1.apk"];
  const testApkFilenames2 = ["com.example.test_minSdk21_VN1.1.0_VC1.apk"];
  const discovery1 = await startDiscovery(
    testApkFilenames1,
    fakeApkInfo.v0_0_1
  );
  const discovery2 = await startDiscovery(
    testApkFilenames2,
    fakeApkInfo.v0_0_1
  );
  const installersPromise = once(discovery1.discovery, "installers");

  await discovery1.start();
  await discovery2.start();

  t.deepEqual(
    (await installersPromise)[0].map(normalizeUrl),
    discovery2.expected.map(normalizeUrl)
  );

  await Promise.all([discovery1.cleanup(), discovery2.cleanup()]);
});

test.only("If peer goes offline, installers become no longer available", async t => {
  const testApkFilenames1 = ["com.example.test_minSdk21_VN1.0.0_VC1.apk"];
  const testApkFilenames2 = ["com.example.test_minSdk21_VN1.1.0_VC1.apk"];
  const discovery1 = await startDiscovery(
    testApkFilenames1,
    fakeApkInfo.v0_0_1
  );
  const discovery2 = await startDiscovery(
    testApkFilenames2,
    fakeApkInfo.v0_0_1
  );
  const installersPromise1st = once(discovery1.discovery, "installers");

  await discovery1.start();
  await discovery2.start();

  t.deepEqual(
    (await installersPromise1st)[0].map(normalizeUrl),
    discovery2.expected.map(normalizeUrl),
    "Installers are available when discovery2 is started"
  );

  const installersPromise2nd = once(discovery1.discovery, "installers");

  await discovery2.discovery.stop();

  t.deepEqual(
    (await installersPromise2nd)[0].map(normalizeUrl),
    [],
    "Installers are no longer available after discovery2 has stopped"
  );

  await Promise.all([discovery1.cleanup(), discovery2.cleanup()]);
});

// @ts-ignore
function normalizeUrl({ filepath, ...other }) {
  return {
    ...other,
    url: other.url
      ? other.url.replace(/^http:\/\/[^/]*/, "")
      : `/installers/${other.hash}`,
  };
}
