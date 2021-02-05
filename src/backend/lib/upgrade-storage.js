const path = require("path");
const mkdirp = require("mkdirp");
const fs = require("fs");
const crypto = require("crypto");
const rimraf = require("rimraf");

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
  constructor(storageDir) {
    if (!storageDir) throw new Error("required argument: storageDir");
    if (typeof storageDir !== "string")
      throw new Error("storageDir must be type string");
    this.currentApk = null;
    this.downloadedApks = [];
    this.dir = storageDir;
    this.androidDownloadDir = path.join(this.dir, "android");
    mkdirp.sync(this.androidDownloadDir);
  }

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
    this.downloadedApks.forEach(option => {
      const opt = Object.assign({}, option);
      delete opt.filename;
      results.push(opt);
    });
    process.nextTick(cb, null, results);
  }

  // String, String, Callback<Void> -> WritableStream
  createApkWritableStream(filename, version, cb) {
    const filepath = path.join(this.androidDownloadDir, filename);

    const ws = fs.createWriteStream(filepath);
    ws.once("error", cb);
    ws.once("finish", () => {
      apkToUpgradeOption(filepath, version, (err, option) => {
        if (err) return cb(err);
        this.downloadedApks.push(option);
        cb(null, option);
      });
    });
    return ws;
  }

  // String -> ReadableStream?
  createReadStream(hash) {
    if (this.currentApk && hash === this.currentApk.hash) {
      return fs.createReadStream(this.currentApk.filename);
    }
    const option = this.downloadedApks.filter(o => o.hash === hash)[0];
    if (option) {
      return fs.createReadStream(option.filename);
    }
    return null;
  }

  // Callback<Void> -> Void
  clearOldApks(cb) {
    rimraf(this.androidDownloadDir, err => {
      this.downloadedApks = [];
      cb(err);
    });
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

module.exports = Storage;
