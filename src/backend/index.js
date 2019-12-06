/*!
 * Mapeo Mobile is an Android app for offline participatory mapping.
 *
 * Copyright (C) 2017 Digital Democracy
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const rnBridge = require("rn-bridge");
const debug = require("debug");
debug.enable("*");

const ServerStatus = require("./status");
const constants = require("./constants");
const createServer = require("./server");
const createBugsnag = require("@bugsnag/js");
const semver = require("semver");
// TODO: Use dynamic value from main package.json (so it works with ios)
const version = "2.0.0-beta.0";

const prereleaseComponents = semver.prerelease(version);
const releaseStage = prereleaseComponents
  ? prereleaseComponents[0]
  : "production";

const log = debug("mapeo-core:index");
const PORT = 9081;
const status = new ServerStatus();
let paused = false;
let storagePath;
let server;

// This is nastily circular: we need an instance of status for the constructor
// of bugsnag (so that we can inform the front-end of errors) but then we need
// the instance of bugsnag for other modules (which are required above, when
// module.exports.bugsnag is still undefined)
const bugsnag = createBugsnag({
  apiKey: "572d472ea9d5a9199777b88ef268da4e",
  releaseStage: releaseStage,
  appVersion: version,
  appType: "server",
  onUncaughtException: err => {
    log("uncaughtException", err);
    status.setState(constants.ERROR);
  },
  onUnhandledRejection: err => {
    log("unhandledRejection", err);
    status.setState(constants.ERROR);
  }
});

module.exports.bugsnag = bugsnag;

status.startHeartbeat();

/**
 * We use a user folder on external storage for some data (custom map styles and
 * presets). "External Storage" on Android does not actually mean an external SD
 * card. It is a shared folder that the user can access. The data folder
 * accessible through rnBridge.app.datadir() is not accessible by the user.
 *
 * We need to wait for the React Native process to tell us where the folder is.
 * This code supports re-starting the server with a different folder if
 * necessary (we probably shouldn't do that)
 */
rnBridge.channel.on("storagePath", path => {
  log("storagePath", path);
  if (path === storagePath) return;
  const prevStoragePath = storagePath;
  if (server)
    server.close(() => {
      log("closed server with storagePath", prevStoragePath);
    });
  storagePath = path;
  try {
    server = createServer({
      privateStorage: rnBridge.app.datadir(),
      sharedStorage: storagePath
    });
  } catch (e) {
    log("createServer error", e);
    bugsnag.notify(e, {
      severity: "error",
      context: "createServer"
    });
  }
  if (!paused) startServer();
});

/**
 * Close the server and pause heartbeat when in background
 * We need to do this because otherwise Android/iOS may shutdown the node
 * process when it sees it is doing things in the background
 */
rnBridge.app.on("pause", pauseLock => {
  paused = true;
  status.pauseHeartbeat();
  stopServer(() => pauseLock.release());
});

// Start things up again when app is back in foreground
rnBridge.app.on("resume", () => {
  // When the RN app requests permissions from the user it causes a resume event
  // but no pause event. We don't need to start the server if it's already
  // listening (because it wasn't paused)
  // https://github.com/janeasystems/nodejs-mobile/issues/177
  if (!paused) return;
  paused = false;
  status.setState(constants.STARTING);
  status.startHeartbeat();
  startServer();
});

function startServer(cb) {
  if (!server) return;
  server.listen(PORT, () => status.setState(constants.LISTENING));
}

function stopServer(cb) {
  if (!server) return;
  status.setState(constants.CLOSING);
  server.close(() => {
    status.setState(constants.CLOSED);
    cb();
  });
}
