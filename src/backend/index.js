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

const ServerStatus = require("./status");
const constants = require("./constants");
const createServer = require("./server");
const { getInstallerInfo } = require("./upgrade-manager/utils");
const createBugsnag = require("@bugsnag/js");
const semverPrerelease = require("semver/functions/prerelease");
const { version } = require("../../package.json");

const prereleaseComponents = semverPrerelease(version);
const releaseStage = prereleaseComponents
  ? prereleaseComponents[0]
  : "production";

const log = debug("mapeo-core:index");
const PORT = 9081;
const status = new ServerStatus();
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
  onUncaughtException: error => {
    log("uncaughtException", error);
    status && status.setState(constants.ERROR, { error });
  },
  onUnhandledRejection: error => {
    log("unhandledRejection", error);
    status && status.setState(constants.ERROR, { error });
  },
});

module.exports.bugsnag = bugsnag;

status.startHeartbeat();

/**
 * We use a user folder on external storage for some data (custom map styles and
 * presets). "External Storage" on Android does not actually mean an external SD
 * card. It is a shared folder that the user can access. The data folder
 * accessible through rnBridge.app.datadir() is not accessible by the user.
 *
 * Other config data such as the path to the APK file is only available in the
 * React Native process, so we pass that to the backend here
 *
 * We need to wait for the React Native process to tell us where the folder is.
 */
rnBridge.channel.once("config", async config => {
  log("config", config);
  if (server) {
    const error = new Error(
      "Server already existed when config event was received"
    );
    status.setState(constants.ERROR, { error, context: "config" });
    return;
  }
  try {
    const {
      sharedStorage,
      privateCacheStorage,
      deviceInfo,
      apkFilepath,
      isDev,
    } = config;
    // Don't debug log in production
    if (isDev) debug.enable("*");
    const currentApkInfo = await getInstallerInfo(apkFilepath);
    server = createServer({
      privateStorage: rnBridge.app.datadir(),
      sharedStorage,
      privateCacheStorage,
      deviceInfo,
      currentApkInfo,
    });
    server.on("error", error => {
      status.setState(constants.ERROR, { error });
    });
    startServer();
  } catch (error) {
    console.log(error.stack);
    status.setState(constants.ERROR, { error, context: "createServer" });
  }
});

/**
 * Close the server and pause heartbeat when in background
 * We need to do this because otherwise Android/iOS may shutdown the node
 * process when it sees it is doing things in the background
 */
rnBridge.app.on("pause", pauseLock => {
  log("App went into background");
  status.pauseHeartbeat();
  stopServer(() => pauseLock.release());
});

// Start things up again when app is back in foreground
rnBridge.app.on("resume", () => {
  log("App went into foreground");
  // When the RN app requests permissions from the user it causes a resume event
  // but no pause event. We don't need to start the server if it's already
  // listening (because it wasn't paused)
  // https://github.com/janeasystems/nodejs-mobile/issues/177
  status.startHeartbeat();
  startServer();
});

const noop = () => {};

function startServer() {
  if (!server) {
    const error = new Error("Tried to start server before config was received");
    status.setState(constants.ERROR, { error, context: "createServer" });
    return;
  }
  const state = status.getState();
  if (state === constants.CLOSING) {
    log("Server was closing when it tried to start");
    server.on("close", () => startServer());
  } else if (state === constants.IDLE || state === constants.CLOSED) {
    status.setState(constants.STARTING);
    server.listen(PORT, () => {
      status.setState(constants.LISTENING);
    });
  } else {
    log("tried to start server but state was: " + state);
  }
}

function stopServer(cb = noop) {
  if (!server) return process.nextTick(cb);
  const state = status.getState();
  if (state === constants.STARTING) {
    log("Server was starting when it tried to close");
    server.on("listening", () => stopServer(cb));
  } else if (state !== constants.IDLE) {
    status.setState(constants.CLOSING);
    server.close(() => {
      status.setState(constants.CLOSED);
      cb();
    });
  } else {
    process.nextTick(cb);
  }
}
