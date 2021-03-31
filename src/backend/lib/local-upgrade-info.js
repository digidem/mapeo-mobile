const path = require("path");
const fs = require("fs");
const RWLock = require("rwlock");

const { UPGRADE_INFO_FILENAME } = require("./constants");

class LocalUpgradeInfo {
  constructor(storageDir) {
    this.storageDir = storageDir;
    this.lock = new RWLock();
  }

  get(cb) {
    this.lock.readLock(release => {
      function done(err, res) {
        release();
        cb(err, res ? res.upgrades : null);
      }

      fs.readFile(
        path.join(this.storageDir, UPGRADE_INFO_FILENAME),
        "utf8",
        (err, buf) => {
          if (err && err.code === "ENOENT") {
            return done(null, { upgrades: [] });
          }
          if (err) return done(err);
          try {
            const data = JSON.parse(buf.toString());
            done(null, data);
          } catch (err) {
            done(err);
          }
        }
      );
    });
  }

  // Add an UpgradeOption to upgrade.json's 'upgrades' list
  add(info, cb) {
    this.lock.writeLock(release => {
      function done(err, res) {
        release();
        cb(err, res);
      }

      const filepath = path.join(this.storageDir, UPGRADE_INFO_FILENAME);

      function write(data) {
        data.upgrades.push(info);
        const json = JSON.stringify(data, null, 2);
        fs.writeFile(filepath, json, "utf8", done);
      }

      fs.readFile(filepath, "utf8", (err, buf) => {
        if (err && err.code === "ENOENT") {
          return write({ upgrades: [] });
        }
        if (err) return done(err);
        try {
          const data = JSON.parse(buf.toString());
          write(data);
        } catch (err) {
          done(err);
        }
      });
    });
  }

  // Replace the entirety of upgrade.json's 'upgrades' list
  set(info, cb) {
    this.lock.writeLock(release => {
      function done(err, res) {
        release();
        cb(err, res);
      }

      const filepath = path.join(this.storageDir, UPGRADE_INFO_FILENAME);

      function write(data) {
        data.upgrades = info;
        const json = JSON.stringify(data, null, 2);
        fs.writeFile(filepath, json, "utf8", done);
      }

      fs.readFile(filepath, "utf8", (err, buf) => {
        if (err && err.code === "ENOENT") {
          return write({ upgrades: [] });
        }
        if (err) return done(err);
        try {
          const data = JSON.parse(buf.toString());
          write(data);
        } catch (err) {
          done(err);
        }
      });
    });
  }
}

module.exports = LocalUpgradeInfo;
