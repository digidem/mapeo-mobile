const { getInstallerInfo } = require("../../upgrade-manager/utils");
const test = require("tape");
const path = require("path");
const { promises: fs } = require("fs");
const { readJson } = require("../helpers");

test("getInstallerInfo: read valid APKs", async t => {
  const validApksFolder = path.join(__dirname, "../fixtures/valid-apks");
  const apkFilepaths = (await fs.readdir(validApksFolder))
    .filter(file => path.extname(file) === ".apk")
    .map(file => path.join(validApksFolder, file));

  for (const filepath of apkFilepaths) {
    const info = await getInstallerInfo(filepath);
    const expected = {
      ...(await readJson(filepath.replace(/\.apk$/, ".expected.json"))),
      filepath,
    };
    t.deepEqual(info, expected, "Info matches expected data");
  }
});

test("getInstallerInfo: invalid APKs", async t => {
  const invalidApksFolder = path.join(__dirname, "../fixtures/invalid-apks");
  const apkFilepaths = (await fs.readdir(invalidApksFolder))
    .filter(file => path.extname(file) === ".apk")
    .map(file => path.join(invalidApksFolder, file));

  apkFilepaths.push("invalidFilePath.apk");

  t.plan(apkFilepaths.length);

  for (const filepath of apkFilepaths) {
    await getInstallerInfo(filepath).catch(e => {
      t.true(e instanceof Error, "Throws with error");
    });
  }
});
