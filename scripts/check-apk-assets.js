#!/usr/bin/env node

const yauzl = require("yauzl");
const path = require("path");

const [apkPath] = process.argv.slice(2);

// Array of regexes or strings to match against file paths in APK
// File paths should *NOT* start with a `/`, and are relative to the root of the APK
const checkList = [
  "assets/index.android.bundle",
  "assets/fonts/MaterialCommunityIcons.ttf",
  "assets/fonts/FontAwesome.ttf",
  "assets/fonts/MaterialIcons.ttf",
  "assets/fonts/Octicons.ttf",
];

yauzl.open(apkPath, { autoClose: false }, (err, zipfile) => {
  if (err) throw err;
  const checked = new Array(checkList.length).fill(false);
  zipfile.on("entry", entry => {
    for (const [i, check] of checkList.entries()) {
      if (
        typeof check === "string"
          ? check === entry.fileName
          : check.test(entry.fileName)
      ) {
        checked[i] = true;
      }
    }
  });
  zipfile.on("error", err => {
    console.error(`Error reading '${path.basename(apkPath)}':`, err);
    process.exit(1);
  });
  zipfile.on("end", () => {
    if (checked.every(Boolean)) {
      console.log(`'${path.basename(apkPath)}' is valid`);
      process.exit(0);
    } else {
      const missing = checkList.filter((_, i) => !checked[i]);
      console.error(
        `'${path.basename(apkPath)}' is missing files:\n  -`,
        missing.map(regex => regex.toString()).join("\n  - ")
      );
      process.exit(1);
    }
  });
});
