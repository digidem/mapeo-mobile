// @ts-check

const path = require("path");
const tmp = require("tmp-promise");
const test = require("tape");
const UpgradeStorage = require("../lib/upgrade-storage");
const UpgradeServer = require("../lib/upgrade-server");
const fs = require("fs");
const { promisify } = require("util");
const stream = require("stream");
const fakeApkInfo = require("./fixtures/fake-apk-info");
const getPort = require("get-port");
const { readJson, hashCmp } = require("./helpers.js");
const fsPromises = fs.promises;
const got = require("got").default;

/** @typedef {import('../lib/types').InstallerInt} InstallerInt */

/** @param {InstallerInt} currentApkInfo */
async function startServer(currentApkInfo) {
  const tmpDir = await tmp.dir({ unsafeCleanup: true });
  const storage = new UpgradeStorage({
    storageDir: tmpDir.path,
    currentApkInfo,
  });
  const server = new UpgradeServer({ storage });
  await server.start(await getPort());

  // @ts-ignore - access private _fastify field for testing
  const app = server._fastify;

  const inject = app.inject.bind(server);
  const cleanup = async () => {
    await server.stop();
    await tmpDir.cleanup();
  };
  const {
    address,
    port,
  } = /** @type {import('net').AddressInfo} */ (app.server.address());
  const baseUrl = `http://${address}:${port}`;
  return { inject, cleanup, baseUrl, storage };
}

test("route: GET /installers returns only current APK by default", async t => {
  const { inject, cleanup, baseUrl } = await startServer(fakeApkInfo.v0_0_1);
  const { filepath, ...expected } = fakeApkInfo.v0_0_1;
  // @ts-ignore
  expected.url = `${baseUrl}/installers/${fakeApkInfo.v0_0_1.hash}`;
  const response = await inject({
    method: "GET",
    url: "/installers",
  });
  t.equal(response.statusCode, 200);
  t.equal(response.headers["content-type"], "application/json; charset=utf-8");
  t.deepEqual(response.json(), [expected]);
  await cleanup();
});

test("route: GET /installers includes APK added to storage", async t => {
  const { inject, cleanup, baseUrl, storage } = await startServer(
    fakeApkInfo.v0_0_1
  );
  const { filepath: _1, ...expected1 } = fakeApkInfo.v0_0_1;
  // @ts-ignore
  expected1.url = `${baseUrl}/installers/${expected1.hash}`;

  const apkFilepath = path.join(
    __dirname,
    "./fixtures/valid-apks/com.example.test_minSdk21_VN1.0.0_VC1.apk"
  );
  const { filepath: _2, ...expected2 } = await readJson(
    apkFilepath.replace(/\.apk/, ".expected.json")
  );
  // @ts-ignore
  expected2.url = `${baseUrl}/installers/${expected2.hash}`;

  // Add apk to storage
  await promisify(stream.pipeline)(
    fs.createReadStream(apkFilepath),
    storage.createWriteStream({ hash: expected2.hash })
  );

  const response = await inject({
    method: "GET",
    url: "/installers",
  });
  t.equal(response.statusCode, 200);
  t.equal(response.headers["content-type"], "application/json; charset=utf-8");
  t.deepEqual(
    response.json().sort(hashCmp),
    [expected1, expected2].sort(hashCmp)
  );
  await cleanup();
});

test("route: not found GET /installers/X", async t => {
  const { inject, cleanup } = await startServer(fakeApkInfo.v0_0_1);
  const response = await inject({
    method: "GET",
    url: "/installers/invalidHash",
  });
  t.equal(response.statusCode, 404);
  t.equal(response.headers["content-type"], "application/json; charset=utf-8");
  t.equal(response.json().error, "Not Found");
  await cleanup();
});

test("route: apk download GET /content/X", async t => {
  const { inject, cleanup, storage } = await startServer(fakeApkInfo.v0_0_1);

  const apkFilepath = path.join(
    __dirname,
    "./fixtures/valid-apks/com.example.test_minSdk21_VN1.0.0_VC1.apk"
  );
  const apkInfo = await readJson(
    apkFilepath.replace(/\.apk/, ".expected.json")
  );
  // Add apk to storage
  await promisify(stream.pipeline)(
    fs.createReadStream(apkFilepath),
    storage.createWriteStream({ hash: apkInfo.hash })
  );

  const response = await inject({
    method: "GET",
    url: `/installers/${apkInfo.hash}`,
  });
  t.equal(response.statusCode, 200);
  t.equal(response.headers["content-type"], "application/octet-stream");
  t.true(
    response.rawPayload.equals(await fsPromises.readFile(apkFilepath)),
    "Response is expected APK"
  );
  await cleanup();
});

test("make an http request after stopped", async t => {
  const { cleanup, baseUrl } = await startServer(fakeApkInfo.v0_0_1);
  await cleanup();

  try {
    await got(`${baseUrl}/installers`);
  } catch (e) {
    t.true(e instanceof Error);
    t.equal(e.code, "ECONNREFUSED");
  }
});

test("make an http request while stopping", async t => {
  const { cleanup, baseUrl } = await startServer(fakeApkInfo.v0_0_1);
  // Don't await, so got() happens before this finishes
  cleanup();

  try {
    await got(`${baseUrl}/installers`);
  } catch (e) {
    t.true(e instanceof Error);
    t.equal(e.code, "ECONNREFUSED");
  }
});
