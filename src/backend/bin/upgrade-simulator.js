const mkdirp = require("mkdirp");
const path = require("path");
const tmp = require("tmp");
const UpgradeManager = require("../lib/upgrade-manager");
const getport = require("getport");
const EventEmitter = require("events").EventEmitter;

const dir = tmp.dirSync().name;
mkdirp.sync(dir);
console.log("tempdir:", dir);

const apkPath =
  process.argv[3] ||
  path.join(
    __dirname,
    "../../../android/app/build/outputs/apk/app/debug/mapeo-app-debug.apk"
  );
const version = process.argv[2] || "5.0.0";

getport((err, port) => {
  if (err) return onError("getport", err);

  const upgradeManager = new UpgradeManager({
    dir,
    port,
    version,
  });

  upgradeManager.on("p2p-upgrade::state", state => {
    console.dir(JSON.stringify(state), { depth: null });
  });

  upgradeManager.setApkInfo(apkPath, version, err => {
    if (err) return onError("setApkInfo", err);
    upgradeManager.startServices();
    console.log(`ready! now serving ${apkPath} on port ${port}`);
  });
});

function onError(prefix, err) {
  if (!err) return;
  console.log(`error(${prefix}): ' + ${err.toString()}`);
}
