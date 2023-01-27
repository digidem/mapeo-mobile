#!/usr/bin/env node

const glob = require("glob");
const util = require("util");
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const path = require("path");
const fs = require("fs");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function readJson(file) {
  return JSON.parse(await readFile(file));
}

async function writeJson(file, data) {
  await mkdirp(path.dirname(file));
  await writeFile(file, JSON.stringify(data, null, 2));
}

const getPackageJson = pathToPackage => {
  return JSON.parse(
    fs.readFileSync(path.join(pathToPackage, "package.json"), "utf8")
  );
};

const getTranslationsPathsFromDependencies = () => {
  const pak = getPackageJson(path.join(__dirname, "../"));
  const translationsPaths = [];

  Object.keys(pak.dependencies).forEach(dependencyName => {
    const nodeModulePath = path.join(
      __dirname,
      "../node_modules",
      dependencyName
    );
    const depPak = getPackageJson(nodeModulePath);

    if (depPak.lang) {
      translationsPaths.push(path.join(nodeModulePath, depPak.lang));
    }
  });

  return translationsPaths;
};

const translationPaths = [
  "messages",
  ...getTranslationsPathsFromDependencies(),
];

const globPattern = "{" + translationPaths.join(",") + "}/**/*.json";

rimraf.sync("translations/*");

// "shared" strings are included in translations for all components
glob(globPattern, async function (er, files) {
  const allMsgs = {};
  for (const file of files) {
    const lang = path.parse(file).name;
    const msgs = await readJson(file);
    if (!allMsgs[lang]) allMsgs[lang] = msgs;
    else allMsgs[lang] = { ...allMsgs[lang], ...msgs };
  }
  const translations = {};
  for (const lang in allMsgs) {
    translations[lang] = {};
    const msgs = allMsgs[lang];
    Object.keys(msgs).forEach(key => {
      if (!msgs[key].message) return;
      translations[lang][key] = msgs[key].message;
    });
  }
  const output = path.join(__dirname, "../translations/messages.json");
  await writeJson(output, translations);
});
