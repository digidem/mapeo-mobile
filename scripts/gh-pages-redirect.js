#!/usr/bin/env node

var Hubfs = require("hubfs.js");

var [path, destUrl] = process.argv.slice(2);

if (typeof path !== "string" || typeof destUrl !== "string") {
  console.error(
    `Create an HTML redirect for Github Pages to the latest release

Usage:

gh-pages-redirect.js <path> <destination url>

Example:

gh-pages-redirect.js /latest https://example.com/releases/mapeo-vX.XX.apk
`
  );
  process.exit(1);
}

var UPDATE_MESSAGE = "Update redirect for " + path;
var BRANCH = "gh-pages";

var hubfsOptions = {
  owner: "digidem",
  repo: "mapeo-apks-bucket-listing",
  auth: {
    token: process.env.GITHUB_TOKEN
  }
};

var gh = Hubfs(hubfsOptions);

var filename = path.replace(/^\//, "").replace(/\/$/, "") + "/index.html";

var data = `<!DOCTYPE html>
<meta charset="utf-8">
<title>Download Mapeo for Android</title>
<meta http-equiv="refresh" content="0; URL=${destUrl}">
<link rel="canonical" href="${destUrl}">
`;

var opts = {
  message: UPDATE_MESSAGE,
  branch: BRANCH
};

gh.writeFile(filename, data, opts, function(err) {
  if (err) onError(err);
  process.exit(0);
});

function onError(err) {
  console.trace(err);
  process.exit(1);
}
