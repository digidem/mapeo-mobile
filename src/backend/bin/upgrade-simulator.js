// @ts-check
const mkdirp = require("mkdirp");
const tmp = require("tmp-promise");
const debug = require("debug");
const UpgradeManager = require("../lib/upgrade-manager");
const { getInstallerInfo } = require("../lib/utils");

const log = debug("p2p-upgrades:simulator");
// Why this? Because I got tired of typing `DEBUG=p2p*` whenever I run the
// upgrade-simulator, and can't see a reason for running this without this
// debugging info turned on, but also I wanted to have the possibility of doing
// `DEBUG=* node ./bin/upgrade-simulator.js` to also get the dns-discovery debug
// messages
if (!process.env.DEBUG) debug.enable("p2p*");

tmp.setGracefulCleanup();

(async () => {
  const tmpDir = await tmp.dir({ unsafeCleanup: true });
  await mkdirp(tmpDir.path);
  log("tempdir:", tmpDir.path);

  const apkPath = process.argv[2];

  if (typeof apkPath !== "string" || !apkPath.endsWith(".apk")) {
    process.stderr.write("Usage: ./upgrade-simulator.mjs path/to/mapeo.apk\n");
    process.exit(1);
  }

  const manager = new UpgradeManager({
    storageDir: tmpDir.path,
    currentApkInfo: await getInstallerInfo(apkPath),
    deviceInfo: { sdkVersion: 21, supportedAbis: ["armeabi-v7a", "arm64-v8a"] },
  });

  manager.on("state", state => {
    log("state: %o", state);
  });

  manager.on("error", error => {
    log("error", error);
  });

  manager.start();
})();
