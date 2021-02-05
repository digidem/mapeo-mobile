const path = require("path");
const mkdirp = require("mkdirp");
const fs = require("fs");
const crypto = require("crypto");
const rimraf = require("rimraf");
const through = require("through2");
const readonly = require("read-only-stream");
const pump = require("pump");
const semver = require("semver");
const LocalUpgradeInfo = require("./local-upgrade-info");

/* type Callback<T> = (Error?, T?) => Void */

/* type UpgradeOption {
    hash: String
    hashType: 'sha256'
    version: String
    platform: 'windows' | 'macos' | 'linux' | 'android' | 'ios'
    arch: Array<'x86' | 'x86_64' | 'armeabi-v7a' | 'arm64-v8a'>
    size: Number,
    id: String
  }
} */

class Storage {
  // String -> Void
  constructor(storageDir, opts) {
    if (!storageDir) throw new Error("required argument: storageDir");
    if (typeof storageDir !== "string")
      throw new Error("storageDir must be type string");

    this.currentApk = null;
    this.localUpgrades = new LocalUpgradeInfo(storageDir);

    this.dir = storageDir;
    mkdirp.sync(this.dir);

    opts = opts || {};
    this.targetPlatform = opts.platform || "android";
    this.targetArch = opts.arch || "arm64-v8a";
    this.version = opts.version || "0.0.0";
  }

  // String, String, Callback<Void> -> Void
  setApkInfo(apkPath, version, cb) {
    apkToUpgradeOption(apkPath, version, (err, info) => {
      if (err) return cb(err);
      this.currentApk = info;
      cb();
    });
  }

  // Callback<[UpgradeOption]> -> Void
  getAvailableUpgrades(cb) {
    const results = [];
    if (this.currentApk) {
      const currentApk = Object.assign({}, this.currentApk);
      delete currentApk.filename;
      results.push(currentApk);
    }
    this.localUpgrades.get((err, options) => {
      if (err) return cb(err);
      options.forEach(option => {
        const opt = Object.assign({}, option);
        delete opt.filename; // XXX: needed still?
        results.push(opt);
      });
      cb(null, results);
    });
  }

  // String, String, Callback<Void> -> WritableStream
  createApkWriteStream(filename, version, cb) {
    cb = cb || function() {};
    const filepath = path.join(this.dir, filename);

    const ws = fs.createWriteStream(filepath);
    ws.once("error", cb);
    ws.once("finish", () => {
      apkToUpgradeOption(filepath, version, (err, option) => {
        if (err) return cb(err);
        this.localUpgrades.add(option, err => {
          if (err) cb(err);
          else cb(null, option);
        });
      });
    });
    return ws;
  }

  // String -> ReadableStream
  createReadStream(hash) {
    if (this.currentApk && hash === this.currentApk.hash) {
      return fs.createReadStream(this.currentApk.filename);
    }
    const t = through();
    this.localUpgrades.get((err, options) => {
      if (err) return t.emit("error", err);
      const option = options.filter(o => o.hash === hash)[0];
      if (option) {
        const rs = fs.createReadStream(option.filename);
        pump(rs, t);
      } else {
        t.emit("error", new Error(`no such upgrade option with hash ${hash}`));
      }
    });
    return readonly(t);
  }

  // Callback<Void> -> Void
  clearOldApks(cb) {
    this.localUpgrades.get((err, options) => {
      if (err) return cb(err);
      const toDelete = options.filter(
        option => !this.isNewerThanCurrentApk(option)
      );
      const toKeep = options.filter(option =>
        this.isNewerThanCurrentApk(option)
      );
      foreachAsync(
        toDelete,
        (option, cb) => {
          rimraf(option.filename, cb);
        },
        _ => {
          // XXX: not handling errors from failed deletions (yet)
          this.localUpgrades.set(toKeep, cb);
        }
      );
    });
  }

  // UpgradeOption -> Bool
  isNewerThanCurrentApk(upgrade) {
    if (upgrade.arch.indexOf(this.targetArch) === -1) return null;
    if (upgrade.platform !== this.targetPlatform) return null;
    if (!semver.valid(upgrade.version)) return null;
    return semver.gt(upgrade.version, this.version);
  }
}

// String, Callback<Buffer> -> Void
function hashFile(filename, cb) {
  try {
    const hash = crypto.createHash("sha256");
    hash.update(fs.readFileSync(filename));
    process.nextTick(cb, null, hash.digest());
  } catch (err) {
    process.nextTick(cb, err);
  }
}

function apkToUpgradeOption(filepath, version, cb) {
  hashFile(filepath, (err, buf) => {
    if (err) return cb(err);
    const hash = buf.toString("hex");
    fs.stat(filepath, (err, info) => {
      if (err) return cb(err);
      const option = {
        filename: filepath,
        hash,
        size: info.size,
        version,
        hashType: "sha256",
        platform: "android",
        arch: ["arm64-v8a"],
        id: hash
      };
      cb(null, option);
    });
  });
}

function foreachAsync(list, fn, cb) {
  (function next(i) {
    if (i >= list.length) return cb();
    fn(list[0], err => {
      if (err) return cb(err);
      next(i + 1);
    });
  })(0);
}

module.exports = Storage;
