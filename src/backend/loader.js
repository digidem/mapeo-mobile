// @ts-check

// This file sets up some global variables that are incorrectly set in
// nodejs-mobile, e.g. the cwd points to root ("/") on mobile, so we override it
// with the nodejs project dir

const os = require("os");
const path = require("path");
const rnBridge = require("rn-bridge");

const nodejsProjectDir = path.resolve(rnBridge.app.datadir(), "nodejs-project");
os.homedir = () => nodejsProjectDir;
process.cwd = () => nodejsProjectDir;
process.env = process.env || {};
process.env.CHLORIDE_JS = "yes"; // Use WebAssembly libsodium

require("./index");
