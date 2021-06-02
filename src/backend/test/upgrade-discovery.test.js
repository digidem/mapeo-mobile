/* eslint-disable promise/param-names */
// @ts-check
const test = require("tape");
const path = require("path");
const getPort = require("get-port");
const { once } = require("events");
const hasha = require("hasha");
const { promises: fsPromises } = require("fs");
const { setupStorage, hashCmp } = require("./helpers.js");
const Discovery = require("../lib/upgrade-discovery");
const Server = require("../lib/upgrade-server");
const fakeApkInfo = require("./fixtures/fake-apk-info");
const _ = require("lodash");
const getStream = require("get-stream");

const validApksFolder = path.join(__dirname, "./fixtures/valid-apks");

// WARNING: These tests are dependent on timing. By default, available
// installers are removed after they have not been seen for 4000ms (TTL).
// Discovery lookup for available peers happens every 2000ms (lookupInterval),
// and discovery will emit the available installers it has found every 5000ms
// (emit throttle). Tests for removed peers rely on the installer emit throttle
// being greater than the TTL (because they take a peer offline then wait for
// the next emit of installers)

/**
 * @param {string[]} apkFilenames List of filenames to copy into temp directory
 * @param {import("../lib/types").InstallerInt} currentApkInfo
 * @param {{ throttle?: number, lookupInterval?: number, discoveryKey?: string }} [options]
 */
async function createDiscovery(
  apkFilenames,
  currentApkInfo,
  { throttle, lookupInterval, discoveryKey = "com.mapeo" } = {}
) {
  const filepaths = apkFilenames.map(filename =>
    path.join(validApksFolder, filename)
  );
  const { storage, expected, cleanup } = await setupStorage(
    filepaths,
    currentApkInfo
  );
  const discovery = new Discovery({
    discoveryKey: discoveryKey,
    installerEmitThrottle: throttle,
    lookupInterval,
  });
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
  const testApkFilenames1 = ["com.example.test_SDK21_VN1.0.0_VC1.apk"];
  const testApkFilenames2 = ["com.example.test_SDK21_VN1.1.0_VC1.apk"];
  const discovery1 = await createDiscovery(
    testApkFilenames1,
    fakeApkInfo.v0_0_1
  );
  const discovery2 = await createDiscovery(
    testApkFilenames2,
    fakeApkInfo.v0_0_1
  );
  const installersPromise = once(discovery1.discovery, "installers");

  await discovery1.start();
  await discovery2.start();

  t.deepEqual(
    (await installersPromise)[0].map(normalizeUrl).sort(hashCmp),
    discovery2.expected.map(normalizeUrl).sort(hashCmp)
  );

  await Promise.all([discovery1.cleanup(), discovery2.cleanup()]);
});

test("Discovery with different discoveryKey does not find each other", async t => {
  const testApkFilenames1 = ["com.example.test_SDK21_VN1.0.0_VC1.apk"];
  const throttle = 1000;
  const discovery1 = await createDiscovery(
    testApkFilenames1,
    fakeApkInfo.v0_0_1,
    { discoveryKey: "com.example1", throttle }
  );
  const discovery2 = await createDiscovery([], fakeApkInfo.v0_0_1, {
    discoveryKey: "com.example2",
    throttle,
  });
  discovery1.discovery.on("installers", () => {
    t.fail(
      "Should not get an installers event, because no peers should be found"
    );
  });

  await discovery1.start();
  await discovery2.start();

  // Need to wait for longer than throttle to make sure we give the installers
  // event a chance to fire
  await new Promise(res => setTimeout(res, throttle + 1000));

  t.pass("Have waited for long enough, and no installers found");

  await Promise.all([discovery1.cleanup(), discovery2.cleanup()]);
});

test("If peer goes offline, installers become no longer available", async t => {
  const testApkFilenames1 = ["com.example.test_SDK21_VN1.0.0_VC1.apk"];
  const testApkFilenames2 = ["com.example.test_SDK21_VN1.1.0_VC1.apk"];
  const discovery1 = await createDiscovery(
    testApkFilenames1,
    fakeApkInfo.v0_0_1
  );
  const discovery2 = await createDiscovery(
    testApkFilenames2,
    fakeApkInfo.v0_0_1
  );
  const installersPromise1st = once(discovery1.discovery, "installers");

  await discovery1.start();
  await discovery2.start();

  t.deepEqual(
    (await installersPromise1st)[0].map(normalizeUrl).sort(hashCmp),
    discovery2.expected.map(normalizeUrl).sort(hashCmp),
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

test("Discovery will find all installers from multiple peers", async t => {
  const testApkFilenames1 = [
    "com.example.test_SDK21_VN1.0.0_VC1.apk",
    "com.example.test_SDK21_VN1.1.0_VC1.apk",
  ];
  const testApkFilenames2 = ["com.example.test_SDK21_VN1.0.0_VC2.apk"];

  const discovery1 = await createDiscovery(
    testApkFilenames1,
    fakeApkInfo.v0_0_1
  );
  const discovery2 = await createDiscovery(
    testApkFilenames2,
    fakeApkInfo.v0_0_1
  );
  const discovery3 = await createDiscovery([], fakeApkInfo.v0_0_1);

  const installersPromise1 = once(discovery3.discovery, "installers");

  await Promise.all([
    discovery1.start(),
    discovery2.start(),
    discovery3.start(),
  ]);

  // We expect discovery3 to find all the installers from both (1) and (2)
  // We expect duplicate installers to be deduped
  const expected1 = _.uniqWith(
    [...discovery1.expected, ...discovery2.expected].map(normalizeUrl),
    _.isEqual
  ).sort(hashCmp);

  const actual1 = (await installersPromise1)[0].map(normalizeUrl).sort(hashCmp);

  t.deepEqual(
    actual1,
    expected1,
    "3rd peer starts with installers from 1st & 2nd"
  );

  const installersPromise2 = once(discovery3.discovery, "installers");

  await discovery2.cleanup();

  // After discovery2 is stopped, we expect only installers from discovery1 to
  // be available to discovery3
  const expected2 = discovery1.expected.map(normalizeUrl).sort(hashCmp);
  const actual2 = (await installersPromise2)[0].map(normalizeUrl).sort(hashCmp);

  t.deepEqual(
    actual2,
    expected2,
    "After 2nd peer goes offline, 3rd peer ends up with just installers from 1st"
  );

  await Promise.all([discovery1.cleanup(), discovery3.cleanup()]);
});

test("Discovery.createReadStream() works for available installer", async t => {
  const testApkFilename = "com.example.test_SDK21_VN1.0.0_VC1.apk";
  const testApkFilepath = path.join(validApksFolder, testApkFilename);
  const testApkHash = await hasha.fromFile(testApkFilepath, {
    algorithm: "sha256",
  });
  const testApkBuf = await fsPromises.readFile(testApkFilepath);

  const discovery1 = await createDiscovery(
    [testApkFilename],
    fakeApkInfo.v0_0_1
  );
  const discovery2 = await createDiscovery([], fakeApkInfo.v0_0_1);

  const installersPromise = once(discovery2.discovery, "installers");
  await Promise.all([discovery1.start(), discovery2.start()]);
  const [installers] = await installersPromise;

  // @ts-ignore
  const testInstaller = installers.find(i => i.hash === testApkHash);
  t.ok(testInstaller, "Our test APK is available");
  const downloaded = await getStream.buffer(
    discovery2.discovery.createReadStream(testApkHash)
  );
  t.ok(
    downloaded.equals(testApkBuf),
    "Buffer returned from readStream matches expected"
  );

  await Promise.all([discovery1.cleanup(), discovery2.cleanup()]);
});

test("Failed createReadStream() will remove installer from available list", async t => {
  // WARNING: This test uses a "hacky" way to simulate a failed download - it
  // tries to read the currentApk, which in our tests is faked, so attempting to
  // read the file will fail. In a real-life scenario the download would fail
  // because of a peer being taken offline or the network failing. The effect
  // _should_ be the same: discovery.createReadStream() throws an error.
  //
  // This test is also fragile to timing due to this hack: We expect the failed
  // download to remove the failed installer from the "available" list, but the
  // next discovery lookup will find the peer again, and re-add it. We avoid
  // this by increasing the lookup interval and reducing the throttle of the
  // "installers" event. This way, after the failed download, we get an
  // "installers" event with installer that failed removed from available,
  // before the next DNS lookup finds it again and considers it to be available
  // again.
  const discovery1 = await createDiscovery([], fakeApkInfo.v0_0_1, {
    lookupInterval: 5000,
  });
  const discovery2 = await createDiscovery([], fakeApkInfo.v2_0_0, {
    throttle: 1000,
    lookupInterval: 5000,
  });

  await Promise.all([discovery1.start(), discovery2.start()]);
  const [installers] = await once(discovery2.discovery, "installers");

  t.deepEqual(
    installers.map(normalizeUrl).sort(hashCmp),
    discovery1.expected.map(normalizeUrl).sort(hashCmp),
    "Peer 1 starts with expected list of available installers"
  );

  const installersPromise = once(discovery2.discovery, "installers");
  try {
    await getStream.buffer(
      discovery2.discovery.createReadStream(fakeApkInfo.v0_0_1.hash)
    );
  } catch (e) {
    t.ok(e instanceof Error, "createReadStream throws an error");
  }

  t.deepEqual((await installersPromise)[0], []);

  await Promise.all([discovery1.cleanup(), discovery2.cleanup()]);
});

// Our "expected" fixtures include a filepath and no url. This map function
// removes the filepath property and adds the expected URL, but without the
// protocol and host. For the actual data, it strips the protocol and host.
// @ts-ignore
function normalizeUrl({ filepath, ...other }) {
  return /** @type {import('../lib/types').InstallerExt} */ ({
    ...other,
    url: other.url
      ? other.url.replace(/^http:\/\/[^/]*/, "")
      : `/installers/${other.hash}`,
  });
}
