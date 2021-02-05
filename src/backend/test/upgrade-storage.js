const path = require("path");
const tmp = require("tmp");
const test = require("tape");
const collect = require("collect-stream");
const Storage = require("../lib/upgrade-storage");

test("set an apk + read it", t => {
  t.plan(6);

  const expected = {
    hash: "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041",
    size: 10,
    version: "1.2.3",
    hashType: "sha256",
    platform: "android",
    arch: ["arm64-v8a"],
    id: "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041"
  };

  const dir = tmp.dirSync().name;
  const storage = new Storage(dir);
  const apkPath = path.join(__dirname, "static", "fake.apk");

  storage.setApkInfo(apkPath, "1.2.3", err => {
    t.error(err);
    storage.getAvailableUpgrades((err, options) => {
      t.error(err);
      t.equals(options.length, 1);
      t.deepEquals(options[0], expected);

      collect(storage.createReadStream(options[0].hash), (err, data) => {
        t.error(err);
        t.equals("fake data\n", data.toString());
      });
    });
  });
});

test("write + clear an upgrade", t => {
  t.plan(9);

  const expected = {
    hash: "810ff2fb242a5dee4220f2cb0e6a519891fb67f2f828a6cab4ef8894633b1f50",
    size: 8,
    version: "3.0.0",
    hashType: "sha256",
    platform: "android",
    arch: ["arm64-v8a"],
    id: "810ff2fb242a5dee4220f2cb0e6a519891fb67f2f828a6cab4ef8894633b1f50"
  };

  const dir = tmp.dirSync().name;
  const storage = new Storage(dir);

  const ws = storage.createApkWritableStream("foo.apk", "3.0.0", err => {
    t.error(err);
    storage.getAvailableUpgrades((err, options) => {
      t.error(err);
      t.equals(options.length, 1);
      t.deepEquals(options[0], expected);

      collect(storage.createReadStream(options[0].hash), (err, data) => {
        t.error(err);
        t.equals("testdata", data.toString());

        storage.clearOldApks(err => {
          t.error(err);
          storage.getAvailableUpgrades((err, options) => {
            t.error(err);
            t.equals(options.length, 0);
          });
        });
      });
    });
  });
  ws.end("testdata");
});
