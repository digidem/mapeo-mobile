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

tmp.setGracefulCleanup();

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

  // @ts-ignore
  const app = server.getFastify();

  const cleanup = async () => {
    await server.stop();
    await tmpDir.cleanup();
  };
  const {
    address,
    port,
  } = /** @type {import('net').AddressInfo} */ (app.server.address());
  const baseUrl = `http://${address}:${port}`;
  return { cleanup, baseUrl, storage, server };
}

/** @type {import('got').OptionsOfJSONResponseBody} */
const gotOptions = { responseType: "json" };

test("route: GET /installers returns only current APK by default", async t => {
  const { cleanup, baseUrl } = await startServer(fakeApkInfo.v0_0_1);
  const { filepath, ...expected } = fakeApkInfo.v0_0_1;
  // @ts-ignore
  expected.url = `${baseUrl}/installers/${fakeApkInfo.v0_0_1.hash}`;
  const response = await got(`${baseUrl}/installers`, gotOptions);
  t.equal(response.statusCode, 200);
  t.equal(response.headers["content-type"], "application/json; charset=utf-8");
  t.deepEqual(response.body, [expected]);
  await cleanup();
});

test("route: GET /installers includes APK added to storage", async t => {
  const { cleanup, baseUrl, storage } = await startServer(fakeApkInfo.v0_0_1);
  const { filepath: _1, ...expected1 } = fakeApkInfo.v0_0_1;
  // @ts-ignore
  expected1.url = `${baseUrl}/installers/${expected1.hash}`;

  const apkFilepath = path.join(
    __dirname,
    "./fixtures/valid-apks/com.example.test_SDK21_VN1.0.0_VC1.apk"
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

  const response = await got(`${baseUrl}/installers`, gotOptions);
  t.equal(response.statusCode, 200);
  t.equal(response.headers["content-type"], "application/json; charset=utf-8");
  t.deepEqual(
    response.body.sort(hashCmp),
    [expected1, expected2].sort(hashCmp)
  );
  await cleanup();
});

test("route: not found GET /installers/X", async t => {
  const { cleanup, baseUrl } = await startServer(fakeApkInfo.v0_0_1);
  const response = await got(`${baseUrl}/installers/invalidHash`, {
    ...gotOptions,
    throwHttpErrors: false,
  });
  t.equal(response.statusCode, 404);
  t.equal(response.headers["content-type"], "application/json; charset=utf-8");
  t.equal(response.body.error, "Not Found");
  await cleanup();
});

test("route: apk download GET /content/X", async t => {
  const { cleanup, storage, baseUrl } = await startServer(fakeApkInfo.v0_0_1);

  const apkFilepath = path.join(
    __dirname,
    "./fixtures/valid-apks/com.example.test_SDK21_VN1.0.0_VC1.apk"
  );
  const apkInfo = await readJson(
    apkFilepath.replace(/\.apk/, ".expected.json")
  );
  // Add apk to storage
  await promisify(stream.pipeline)(
    fs.createReadStream(apkFilepath),
    storage.createWriteStream({ hash: apkInfo.hash })
  );

  const response = await got(`${baseUrl}/installers/${apkInfo.hash}`, {
    responseType: "buffer",
  });
  t.equal(response.statusCode, 200);
  t.equal(response.headers["content-type"], "application/octet-stream");
  t.true(
    response.body.equals(await fsPromises.readFile(apkFilepath)),
    "Response is expected APK"
  );
  await cleanup();
});

test("make an http request after stopped", async t => {
  const { cleanup, baseUrl } = await startServer(fakeApkInfo.v0_0_1);

  // Check the server is actually running first
  await got(`${baseUrl}/installers`);
  t.pass("Initial request ran without error");

  await cleanup();

  try {
    await got(`${baseUrl}/installers`);
    t.fail("Should have thrown");
  } catch (e) {
    t.true(e instanceof Error);
    t.equal(e.code, "ECONNREFUSED");
  }
});

test("make an http request while stopping", async t => {
  const { cleanup, baseUrl } = await startServer(fakeApkInfo.v0_0_1);

  // Check the server is actually running first
  await got(`${baseUrl}/installers`);
  t.pass("Initial request ran without error");

  // Don't await, so got() happens before this finishes
  cleanup();

  try {
    await got(`${baseUrl}/installers`);
    t.fail("should have thrown");
  } catch (e) {
    t.true(e instanceof Error);
    t.equal(e.code, "ECONNREFUSED");
  }
});

test("Server can be re-started after stop", async t => {
  const { cleanup, baseUrl, server } = await startServer(fakeApkInfo.v0_0_1);

  // Check the server is actually running first
  await got(`${baseUrl}/installers`);
  t.pass("Initial request ran without error");

  await server.stop();

  try {
    // Server is stopped, this should throw
    await got(`${baseUrl}/installers`);
    t.fail("Should have thrown");
  } catch (e) {
    t.true(e instanceof Error);
    t.equal(e.code, "ECONNREFUSED");
  }

  // Start server again
  const port = await getPort();
  await server.start(port);

  // Check server is running again
  await got(`http://localhost:${port}/installers`);
  t.pass("Request after restart ran without error");

  await cleanup();
});
