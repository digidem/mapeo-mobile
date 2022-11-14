#!/usr/bin/env node

const glob = require("glob");
const util = require("util");
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const path = require("path");
const fs = require("fs");
const languageNameTranslations = require("../src/frontend/languages.json");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function readJson(file) {
  return JSON.parse(await readFile(file));
}

async function writeJson(file, data) {
  await mkdirp(path.dirname(file));
  await writeFile(file, JSON.stringify(data, null, 2));
}

rimraf.sync("translations/*");

// "shared" strings are included in translations for all components
glob("messages/**/*.json", async function (er, files) {
  const allMsgs = {};
  for (const file of files) {
    const lang = path.parse(file).name;
    const msgs = await readJson(file);
    // If a language is added to Crowdin, but has no translated messages,
    // Crowdin still creates an empty file, so we just ignore it
    if (Object.keys(msgs).length === 0) continue;
    if (!allMsgs[lang]) allMsgs[lang] = msgs;
    else allMsgs[lang] = { ...allMsgs[lang], ...msgs };
  }
  const translations = {};
  for (const lang in allMsgs) {
    if (!languageNameTranslations[lang]) {
      console.warn(`Locale '${lang}' has no language name defined in \`src/frontend/languages.json\`,
so it will not appear as a language option in Mapeo.
Add the language name in English and the native langague to \`languages.json\`
in order to allow users to select '${lang}' in Mapeo`);
    }
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
