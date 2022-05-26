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
// @ts-check
// @ts-ignore
const rnBridge = require("rn-bridge");
const debug = require("debug");

const ServerStatus = require("./status");
const constants = require("./constants");
const createServer = require("./server");
const { getInstallerInfo } = require("./upgrade-manager/utils");
const Bugsnag = require("@bugsnag/js").default;
const semverPrerelease = require("semver/functions/prerelease");

const log = debug("mapeo-core:index");
const PORT = 9081;
const BUGSNAG_API_KEY = "c7f8a8d9e9c9f0b0f9e8e8d9a7f8a8d9";

module.exports = init;

/** @param {import('../shared-types').ServerStartupConfig} config */
async function init(config) {
  const {
    bundleId,
    version,
    isDev,
    sharedStorage,
    privateCacheStorage,
    supportedAbis,
    sdkVersion,
    apkFilepath,
  } = config;

  const variant = bundleId.endsWith("icca") ? "icca" : "mapeo";
  const releaseStage =
    isDev || bundleId.endsWith("debug")
      ? "development"
      : parseReleaseStage(version);
  // Don't debug log in production
  if (releaseStage !== "production") debug.enable("*");
  log("config", arguments[0]);

  Bugsnag.start({
    apiKey: BUGSNAG_API_KEY,
    releaseStage,
    appVersion: version,
    enabledReleaseStages: ["production", "rc", "internal"],
    appType: "android_node",
    metadata: { variant },
    onUncaughtException: error => {
      log("uncaughtException", error);
      status &&
        status.setState(constants.ERROR, {
          error,
          context: "uncaughtException",
        });
    },
    onUnhandledRejection: error => {
      log("unhandledRejection", error);
      status &&
        status.setState(constants.ERROR, {
          error,
          context: "unhandledRejection",
        });
    },
  });

  const status = new ServerStatus();
  status.startHeartbeat();

  try {
    const currentApkInfo = await getInstallerInfo(apkFilepath);
    const server = createServer({
      privateStorage: rnBridge.app.datadir(),
      sharedStorage,
      privateCacheStorage,
      deviceInfo: { supportedAbis, sdkVersion },
      currentApkInfo,
    });
    server.on("error", error => {
      status.setState(constants.ERROR, { error, context: "server" });
    });
    startServer();

    /**
     * Close the server and pause heartbeat when in background
     * We need to do this because otherwise Android/iOS may shutdown the node
     * process when it sees it is doing things in the background
     */
    rnBridge.app.on(
      "pause",
      /** @param {any} pauseLock */ pauseLock => {
        log("App went into background");
        status.pauseHeartbeat();
        stopServer(() => pauseLock.release());
      }
    );

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

    // eslint-disable-next-line no-inner-declarations
    function startServer() {
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

    const noop = () => {};

    // eslint-disable-next-line no-inner-declarations
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
  } catch (error) {
    console.log(error.stack);
    status.setState(constants.ERROR, { error, context: "createServer" });
  }
}

/**
 * @param {string} version
 * @returns {'production' | 'rc' | 'internal'}
 */
function parseReleaseStage(version) {
  const prereleaseComponents = semverPrerelease(version);
  if (!prereleaseComponents) return "production";
  if (prereleaseComponents[0] === "rc") return "rc";
  return "internal";
}
