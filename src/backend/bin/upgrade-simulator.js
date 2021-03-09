const path = require("path");
const mkdirp = require("mkdirp");
const fs = require("fs");
const rimraf = require("rimraf");
const pump = require("pump");
const tmp = require("tmp");
const UpgradeManager = require("../lib/upgrade-manager");
const getport = require("getport");
const EventEmitter = require("events").EventEmitter;

const dir = tmp.dirSync().name;
mkdirp.sync(dir);
console.log("tempdir:", dir);

const apkPath =
  "../../android/app/build/outputs/apk/app/debug/mapeo-app-debug.apk";
const version = process.argv[2] || "5.0.0";

const ev = new EventEmitter();

getport((err, port) => {
  if (err) return cb(err);

  const upgradeManager = new UpgradeManager(
    dir,
    port,
    version,
    function (type) {
      // console.log('EMIT', type)
      if (type === "p2p-upgrade::state")
        console.dir(JSON.stringify(arguments[1]), { depth: null });
      ev.emit(type, ...arguments);
    },
    (type, fn) => {
      // console.log('LISTEN', type)
      ev.on(type, fn);
    },
    (type, fn) => {
      // console.log('REMOVE', type)
      ev.removeListener(type, fn);
    }
  );

  upgradeManager.setApkInfo(apkPath, version, err => {
    if (err) return onError("setApkInfo", err);
    ev.emit("p2p-upgrade::start-services");
    console.log(`ready! now serving ${apkPath} on port ${port}`);
  });
});

function onError(prefix, err) {
  if (!err) return;
  console.log(`error(${prefix}): ' + ${err.toString()}`);
}
