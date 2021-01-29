const path = require("path");
const tmp = require("tmp");
const test = require("tape");
const Storage = require("../lib/upgrade-storage");

test("basic", t => {
  t.plan(4);

  const expected = {
    filename: "fake.apk",
    hash: "b862a01811a7aa7d9c6fb02987ff69d850ffaff9d34365d42969d08ae2f6a140",
    size: 10,
    version: "1.2.3",
    hashType: "sha256",
    platform: "android",
    arch: "arm64-v8a",
    id: "b862a01811a7aa7d9c6fb02987ff69d850ffaff9d34365d42969d08ae2f6a140"
  };

  const dir = tmp.dirSync().name;
  const storage = new Storage(dir);

  storage.setApkInfo(path.join(__dirname, "fake.apk"), "1.2.3", err => {
    t.error(err);
    storage.getAvailableUpgrades((err, options) => {
      t.error(err);
      t.equals(options.length, 1);
      options[0].filename = path.basename(options[0].filename);
      t.deepEquals(options[0], expected);
    });
  });
});

test("write + clear an upgrade", t => {
  t.plan(7);

  const expected = {
    filename: "foo.apk",
    hash: "810ff2fb242a5dee4220f2cb0e6a519891fb67f2f828a6cab4ef8894633b1f50",
    size: 8,
    version: "3.0.0",
    hashType: "sha256",
    platform: "android",
    arch: "arm64-v8a",
    id: "810ff2fb242a5dee4220f2cb0e6a519891fb67f2f828a6cab4ef8894633b1f50"
  };

  const dir = tmp.dirSync().name;
  const storage = new Storage(dir);

  const ws = storage.createApkWritableStream("foo.apk", "3.0.0", err => {
    t.error(err);
    storage.getAvailableUpgrades((err, options) => {
      t.error(err);
      t.equals(options.length, 1);
      options[0].filename = path.basename(options[0].filename);
      t.deepEquals(options[0], expected);

      storage.clearOldApks(err => {
        t.error(err);
        storage.getAvailableUpgrades((err, options) => {
          t.error(err);
          t.equals(options.length, 0);
        });
      });
    });
  });
  ws.end("testdata");
});
