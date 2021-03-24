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
const log = require("debug")("p2p-upgrades:storage");

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
    this.tmpdir = path.join(storageDir, "tmp");

    // Wipe the contents of 'tmpdir' on init + re-create.
    log("wiping temporary files..");
    rimraf.sync(this.tmpdir);
    log("..done. recreating temp directory..");
    mkdirp.sync(this.tmpdir);
    log("..done");

    opts = opts || {};
    this.targetPlatform = opts.platform || "android";
    this.targetArch = opts.arch || "arm64-v8a";
    this.version = opts.version || "0.0.0";
  }

  getLocalPlatform() {
    return this.targetPlatform;
  }

  getLocalArch() {
    return this.targetArch;
  }

  getLocalVersion() {
    return this.version;
  }

  // String, String, Callback<Void> -> Void
  // TODO: factor out the 'version' parameter and use 'this.version' instead,
  // since we already have it.
  setApkInfo(apkPath, version, cb) {
    log("setApkInfo", apkPath, version);
    this.apkToUpgradeOption(apkPath, version, (err, info) => {
      if (err) return cb(err);
      this.currentApk = info;
      cb();
    });
  }

  // Callback<[UpgradeOption]> -> Void
  getAvailableUpgrades(cb) {
    log("getAvailableUpgrades");
    const results = [];
    if (this.currentApk) {
      const currentApk = Object.assign({}, this.currentApk);
      results.push(currentApk);
    }
    this.localUpgrades.get((err, options) => {
      if (err) return cb(err);
      options.forEach(option => {
        const opt = Object.assign({}, option);
        results.push(opt);
      });
      log("getAvailableUpgrades results:", results);
      cb(null, results);
    });
  }

  // String, String, Callback<Void> -> WritableStream
  createApkWriteStream(filename, version, hash, cb) {
    cb = cb || function () {};
    if (typeof hash === "string") hash = Buffer.from(hash, "hex");
    const tmpFilepath = path.join(this.tmpdir, filename);
    const finalFilepath = path.join(this.tmpdir, filename);
    const reqId = Math.floor(Math.random() * 1000000).toString(16);
    log(reqId, "createApkWriteStream", tmpFilepath, version, hash);

    const ws = fs.createWriteStream(tmpFilepath);
    ws.once("error", err => {
      log(reqId, "createApkWriteStream: pipeline failed:", err);
      rimraf(tmpFilepath, err2 => {
        if (err2) cb(err2);
        else cb(err);
      });
    });
    ws.once("finish", () => {
      // Check hash.
      hashFile(tmpFilepath, (err, ourHash) => {
        if (err) {
          log(reqId, "createApkWriteStream: hash compute failure:", err);
          return cb(err);
        }
        log(reqId, "createApkWriteStream: new file hashed ok");

        // Delete the file if the hash does not match.
        if (!hash.equals(ourHash)) {
          log(
            reqId,
            `createApkWriteStream: hashes don't match (theirs=${hash.toString(
              "hex"
            )}, ours=${ourHash.toString("hex")})`
          );
          rimraf(tmpFilepath, err2 => {
            if (err2) return cb(err2);
            cb(
              new Error(
                `hashes did not match (theirs=${hash.toString(
                  "hex"
                )} ours=${ourHash.toString("hex")})`
              )
            );
          });
          return;
        }
        log(reqId, "createApkWriteStream: hashes match");

        // Move the file to the main upgrade directory.
        fs.rename(tmpFilepath, finalFilepath, err => {
          if (err) {
            log(reqId, "failed to move file from tmpdir to upgrades dir:", err);
            return cb(err);
          }
          log(
            reqId,
            "createApkWriteStream: moved file from tmpdir to upgrades dir ok"
          );

          // Write the downloaded upgrade to the manifest.
          this.apkToUpgradeOption(finalFilepath, version, (err, option) => {
            if (err) return cb(err);
            this.localUpgrades.add(option, err => {
              if (err) {
                log(reqId, "failed to write new upgrade to manifest");
                cb(err);
              } else {
                log(reqId, "wrote new upgrade to manifest ok");
                cb(null, option);
              }
            });
          });
        });
      });
    });
    return ws;
  }

  // String -> ReadableStream
  createReadStream(hash) {
    const reqId = Math.floor(Math.random() * 1000000).toString(16);
    log(reqId, "createReadStream");
    if (this.currentApk && hash === this.currentApk.hash) {
      log(reqId, "createReadStream: serving our local APK");
      return fs.createReadStream(this.currentApk.filename);
    }
    const t = through();
    this.localUpgrades.get((err, options) => {
      if (err) return t.emit("error", err);
      const option = options.filter(o => o.hash === hash)[0];
      if (option) {
        log(reqId, "createReadStream: serving downloaded upgrade", hash);
        const rs = fs.createReadStream(option.filename);
        pump(rs, t);
      } else {
        log(reqId, "createReadStream: asked for hash we don't have:", hash);
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

  apkToUpgradeOption(filepath, version, cb) {
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
          id: hash,
        };
        cb(null, option);
      });
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
