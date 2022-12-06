const http = require("http");
const path = require("path");
const level = require("level");
const kappa = require("kappa-core");
const raf = require("random-access-file");
const createOsmDbOrig = require("kappa-osm");
const createMediaStore = require("safe-fs-blob-store");
const createMapeoRouter = require("mapeo-server");
const debug = require("debug");
const mkdirp = require("mkdirp");
const rnBridge = require("rn-bridge");
const Bugsnag = require("@bugsnag/js").default;
const throttle = require("lodash/throttle");
const fs = require("fs");
const rimraf = require("rimraf");
const tar = require("tar-fs");
const pump = require("pump");
const semverCoerce = require("semver/functions/coerce");
const { serializeError } = require("serialize-error");

const MapServer = require("./mapServer");
const UpgradeManager = require("./upgrade-manager");

const log = debug("mapeo-core:server");

module.exports = createServer;

/**
 * @param {object} opts
 * @param {string} opts.privateStorage Path to app-specific internal file storage
 *   folder (see https://developer.android.com/training/data-storage/app-specific).
 *   This folder cannot be accessed by other apps or the user via a computer connection.
 * @param {string} opts.sharedStorage Path to app-specific external file storage folder
 * @param {string} opts.privateCacheStorage Path to app-specific internal cache storage folder
 * @param {import('./upgrade-manager/types').DeviceInfo} opts.deviceInfo sdkVersion and supportedAbis for current device
 * @param {import('./upgrade-manager/types').InstallerInt} opts.currentApkInfo info about the currently running APK (see ./lib/types for documentation)
 */
function createServer({
  privateStorage,
  sharedStorage,
  privateCacheStorage,
  deviceInfo,
  currentApkInfo,
}) {
  log("Creating server");
  // Folder the user copies custom config into. TODO: This is now handled within
  // the app settings screen, so this could move into privateStorage
  const defaultConfigPath = path.join(sharedStorage, "presets/default");
  // Set up the p2p upgrades subsystem.
  const upgradeStoragePath = path.join(privateCacheStorage, "upgrades");
  // Folder with default (built-in) presets to server when the user has not
  // added any presets
  const fallbackPresetsDir = path.join(privateStorage, "nodejs-assets/presets");

  // create folders for presets & styles
  mkdirp.sync(defaultConfigPath);
  mkdirp.sync(upgradeStoragePath);
  mkdirp.sync(path.join(sharedStorage, "styles/default"));

  let projectKey = readProjectKey({
    defaultConfigPath,
    fallbackPresetsDir,
  });

  // The main osm db for observations and map data
  let { osm, close: closeOsm } = createOsmDb({
    feedsDir: path.join(privateStorage, "db"),
    indexDir: path.join(privateStorage, "index"),
    encryptionKey: projectKey,
  });

  // The media store for photos, video etc.
  const media = createMediaStore(path.join(privateStorage, "media"));

  // Handles all other routes for Mapeo
  let mapeoRouter = createMapeoRouter(osm, media, {
    staticRoot: sharedStorage,
    writeFormat: "osm-p2p-syncfile",
    fallbackPresetsDir: fallbackPresetsDir,
    deviceType: "mobile",
  });
  let mapeoCore = mapeoRouter.api.core;

  const mapServer = createMapServer();
  createUpgradeManager();

  const server = http.createServer(function requestListener(req, res) {
    log(req.method + ": " + req.url);
    // Check if the route is handled by Mapeo Server
    var match = mapeoRouter.handle(req, res);

    // If not and headers are not yet sent, send a 404 error
    if (!match && !res.headersSent) {
      res.statusCode = 404;
      const error = {
        code: 404,
        message: "NotFound",
      };
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(error));
    }
  });

  const origListen = server.listen;
  const origClose = server.close;
  // Sending data over the bridge to RN is costly, and progress events fire
  // frequently, so we throttle updates to once every 500ms
  const throttledSendPeerUpdateToRN = throttle(sendPeerUpdateToRN, 500);

  function onNewPeer(peer) {
    throttledSendPeerUpdateToRN(peer);
    if (!peer.sync) {
      return log("Could not monitor peer, missing sync property");
    }
    peer.sync.once("sync-start", () => {
      syncWatch(peer.sync);
    });
  }

  function syncWatch(sync) {
    const startTime = Date.now();
    sync.on("error", onerror);
    sync.on("progress", throttledSendPeerUpdateToRN);
    sync.on("end", onend);
    sendPeerUpdateToRN();

    function onerror(err) {
      Bugsnag.notify(err, event => {
        event.severity = "error";
        event.context = "sync";
      });
      sendPeerUpdateToRN();
      sync.removeListener("error", onerror);
      sync.removeListener("progress", throttledSendPeerUpdateToRN);
      sync.removeListener("end", onend);
    }

    function onend(err) {
      if (err) log(err.message);
      const syncDurationSecs = ((Date.now() - startTime) / 1000).toFixed(2);
      log("Sync completed in " + syncDurationSecs + " seconds");
      sync.removeListener("error", onerror);
      sync.removeListener("progress", throttledSendPeerUpdateToRN);
      sync.removeListener("end", onend);
      sendPeerUpdateToRN();
    }
  }

  server.listen = function listen(...args) {
    mapeoCore.sync.listen(() => {
      mapeoCore.sync.on("peer", onNewPeer);
      mapeoCore.sync.on("down", throttledSendPeerUpdateToRN);
      rnBridge.channel.on("sync-start", startSync);
      rnBridge.channel.on("sync-join", joinSync);
      rnBridge.channel.on("sync-leave", leaveSync);
      rnBridge.channel.on("replace-config", replaceConfig);
      log("++++ 1 backend listening");
      origListen.apply(server, args);
    });

    mapServer.start();
  };

  function onError(prefix, err) {
    if (!err) return;
    Bugsnag.notify(err, event => {
      event.severity = "error";
      event.context = prefix;
    });
    log(`error(${prefix}): ' + ${err.toString()}`);
  }

  /**
   * Setup function for creating the map server
   *
   * @returns {{ start: () => void, stop: () => void }} Object with start and stop methods
   */
  function createMapServer() {
    let handleGetState, handleReportErrorState, mapServer;

    try {
      // Due to lack of foresight, I didn't add proper db migrations for some map server schema
      // changes that occurred after the initial integration into the mobile app.
      // This means that users with the initial db instance ("maps.db") would experience errors
      // upon upgrading because the "initial" db step that the updated map server module performs
      // assumes an incompatible schema with the existing instance, which would cause initialization
      // errors for the server. This would not be an issue for users who completely uninstall
      // and reinstall, or who install for the first time.
      //
      // The workaround solution for this is to point to a different file path to use as the
      // database moving forward and remove the artifacts from the initial iteration.
      // Normally this would be a terrible idea because it would result in losing valuable map server data,
      // but since this has not been officially released for public usage at the time of writing this comment,
      // it should be okay to do this as a one time legacy-esque exception. After a while, we may be able to
      // confidently remove this code if we feel that enough existing users have installed this version.
      try {
        const legacyMapsDbPath = path.join(privateStorage, "maps.db");
        fs.unlinkSync(legacyMapsDbPath);
        fs.unlinkSync(legacyMapsDbPath + "-shm");
        fs.unlinkSync(legacyMapsDbPath + "-wal");
        log("Successfully removed legacy map server db");
      } catch {
        log("Could not find legacy map server db to remove");
      }

      const officialMapsDbPath = path.join(privateStorage, "mapeo-maps.db");

      mapServer = new MapServer({ dbPath: officialMapsDbPath });

      mapServer.on("state", onState);
      mapServer.on("error", handleError);

      handleGetState = createGetStateHandler(mapServer);

      rnBridge.channel.on("map-server::get-state", handleGetState);
    } catch (err) {
      Bugsnag.notify(err, event => {
        event.severity = "error";
        event.context = "map-server";
      });

      log(`error initializing map-server: ${err.toString()}`);

      handleReportErrorState = function handleError() {
        // If MapServer fails to initialize, we always report the state as
        // the error, and ignore all the other IPC messages
        onState({
          value: "error",
          error: err,
        });
      };

      rnBridge.channel.on("map-server::get-state", handleReportErrorState);
    }

    function createGetStateHandler(mapServer) {
      return function handleGetState() {
        // Don't particularly like this way of doing things, eventually we will
        // set up and RPC for calling these methods directly
        const state = mapServer.getState();
        onState(state);
      };
    }

    function onState(state) {
      // Serialize error object so it can be transferred over ipc
      const serializedErrorState = {
        ...state,
        error: serializeError(state.error),
      };
      rnBridge.channel.post("map-server::state", serializedErrorState);
    }

    function handleError(err) {
      onError("map-server", err);
      const serializedError = serializeError(err);
      rnBridge.channel.post("map-server::error", serializedError);
    }

    return {
      start: () => {
        log("Starting map server");

        // TODO: Handle this better
        if (!mapServer) {
          log("Map server instance does not exist");
          return;
        }

        handleGetState = createGetStateHandler(mapServer);
        rnBridge.channel.on("map-server::get-state", handleGetState);

        mapServer
          .start()
          .then(() => {
            // Tell the client which port the server is running on
            rnBridge.channel.post("map-server::start", {
              port: mapServer.port,
            });
          })
          .catch(err => onError("map-server-start", err));
      },
      stop: () => {
        log("Stopping map server");

        if (handleGetState) {
          rnBridge.channel.removeListener(
            "map-server::get-state",
            handleGetState
          );
        }

        if (handleReportErrorState) {
          rnBridge.channel.removeListener(
            "map-server::get-state",
            handleReportErrorState
          );
        }

        // TODO: Handle this better
        if (!mapServer) {
          log("Map server instance does not exist");
          return;
        }

        mapServer.stop().catch(err => onError("map-server-stop", err));
      },
    };
  }

  function createUpgradeManager() {
    // TODO: What is the effect of leaving these event handlers attached when
    // the app is in the background? Ideally we would clean up event handlers
    // each time the app goes to the background and re-attach them when back in
    // foreground.

    try {
      const manager = new UpgradeManager({
        storageDir: upgradeStoragePath,
        currentApkInfo,
        deviceInfo,
      });
      manager.on("state", onState);
      manager.on("error", err => {
        onError("p2p-upgrade", err);
        const serializedError = serializeError(err);
        rnBridge.channel.post("p2p-upgrade::error", serializedError);
      });
      rnBridge.channel.on("p2p-upgrade::start-services", () => {
        log("Request to start upgrade manager");
        manager.start().catch(err => onError("p2p-start", err));
      });
      rnBridge.channel.on("p2p-upgrade::stop-services", () => {
        log("Request to stop upgrade manager");
        manager.stop().catch(err => onError("p2p-stop", err));
      });
      rnBridge.channel.on("p2p-upgrade::get-state", () => {
        // Don't particularly like this way of doing things, eventually we will
        // set up and RPC for calling these methods directly
        const state = manager.getState();
        onState(state);
      });
    } catch (err) {
      Bugsnag.notify(err, event => {
        event.severity = "error";
        event.context = "p2p-upgrade";
      });
      log(`error initializing p2p-upgrade: ${err.toString()}`);

      rnBridge.channel.on("p2p-upgrade::get-state", () => {
        // If UpgradeManager fails to initialize, we always report the state as
        // the error, and ignore all the other IPC messages

        /** @type {import("./upgrade-manager/types").UpgradeState} */
        const state = {
          value: "error",
          error: err,
          uploads: [],
          downloads: [],
          checkedPeers: [],
        };
        onState(state);
      });
    }

    /** @param {import("./upgrade-manager/types").UpgradeState} state */
    function onState(state) {
      // Serialize error object so it can be transferred over ipc
      const serializedErrorState = {
        ...state,
        error: serializeError(state.error),
      };
      rnBridge.channel.post("p2p-upgrade::state", serializedErrorState);
    }
  }

  // Given a config tarball at `path`, replace the current config.
  function replaceConfig({ id, path: pathToNewConfigTarball }) {
    const cb = err =>
      rnBridge.channel.post("replace-config-" + id, err && err.message);
    const tmpDir = path.join(
      sharedStorage,
      (Math.random() * Math.pow(10, 10)).toFixed(0)
    );

    fs.mkdir(tmpDir, err => {
      // 1 - extract to temp directory
      if (err) {
        log("Could not create tmp directory for config extract", err);
        return cb(err);
      }
      var source = fs.createReadStream(pathToNewConfigTarball);
      var dest = tar.extract(tmpDir, {
        readable: true,
        writable: true,
        // Samsung devices throw EPERM error if you try to set utime
        utimes: false,
      });
      pump(source, dest, onExtract);

      // 2 - If extract worked, check version
      function onExtract(err) {
        // TODO: Better checking that presets are valid
        if (err) {
          log("Error extracting config tarball", err);
          return cb(err);
        }
        fs.readFile(path.join(tmpDir, "VERSION"), "utf8", (err, version) => {
          const parsedVersion = semverCoerce(version);
          if (err || parsedVersion == null) {
            log("Error reading VERSION file from imported config");
            return cb(err || new Error("Unreadable config version"));
          }
          if (parsedVersion.major > 3 || parsedVersion.major < 2) {
            log(
              "Mapeo is not compatible with this config version (" +
                version +
                ")"
            );
            return cb(new Error("Incompatible config version"));
          }
          log("Importing config version: " + version);
          onVersionCheck();
        });
      }

      // 3 - Presets look ok, replace current presets with these
      function onVersionCheck() {
        // Need to rimraf() because fs.rename gives an error if the destination
        // directory is not empty, despite what the nodejs docs say
        // (https://github.com/nodejs/node/issues/21957)
        rimraf(defaultConfigPath, err => {
          if (err) {
            log("Error trying to remove existing config", err);
            return cb(err);
          }
          fs.rename(tmpDir, defaultConfigPath, err => {
            if (err) {
              log("Error replacing existing config with new config", err);
              return cb(err);
            }
            log("Successfully replaced config");
            onChangeConfig();
          });
        });
      }
    });

    function onChangeConfig() {
      // After changing the config the projectKey can change, so we need to
      // create a new instance of kappa-osm
      closeOsm(() => {
        projectKey = readProjectKey({
          defaultConfigPath,
          fallbackPresetsDir,
        });

        const newDb = createOsmDb({
          feedsDir: path.join(privateStorage, "db"),
          indexDir: path.join(privateStorage, "index"),
          encryptionKey: projectKey,
        });

        osm = newDb.osm;
        closeOsm = newDb.close;

        mapeoRouter = createMapeoRouter(osm, media, {
          staticRoot: sharedStorage,
          writeFormat: "osm-p2p-syncfile",
          fallbackPresetsDir: fallbackPresetsDir,
          deviceType: "mobile",
        });
        mapeoCore = mapeoRouter.api.core;

        cb();
      });
    }
  }

  // Send message to frontend whenever there is an update to the peer list
  function sendPeerUpdateToRN(peer) {
    const peers = mapeoCore.sync.peers().map(peer => {
      const { connection, ...rest } = peer;
      return {
        ...rest,
        channel: Buffer.isBuffer(rest.channel)
          ? rest.channel.toString("hex")
          : undefined,
        swarmId: Buffer.isBuffer(rest.swarmId)
          ? rest.swarmId.toString("hex")
          : undefined,
      };
    });
    rnBridge.channel.post("peer-update", peers);
  }

  function startSync(target = {}) {
    if (!target.host || !target.port) return;
    const sync = mapeoCore.sync.replicate(target, { deviceType: "mobile" });
    syncWatch(sync);
  }

  function joinSync({ deviceName } = {}) {
    try {
      if (deviceName) mapeoCore.sync.setName(deviceName);
      log("Joining swarm", projectKey && projectKey.slice(0, 4));
      mapeoCore.sync.join(projectKey);
    } catch (e) {
      Bugsnag.notify(e, event => {
        event.severity = "error";
        event.context = "sync join";
      });
    }
  }

  function leaveSync() {
    try {
      log("Leaving swarm", projectKey && projectKey.slice(0, 4));
      mapeoCore.sync.leave(projectKey);
    } catch (e) {
      Bugsnag.notify(e, event => {
        event.severity = "error";
        event.context = "sync leave";
      });
    }
  }

  server.close = function close(cb) {
    mapeoCore.sync.removeListener("peer", onNewPeer);
    mapeoCore.sync.removeListener("down", throttledSendPeerUpdateToRN);
    rnBridge.channel.removeListener("sync-start", startSync);
    rnBridge.channel.removeListener("sync-join", joinSync);
    rnBridge.channel.removeListener("sync-leave", leaveSync);
    rnBridge.channel.removeListener("replace-config", replaceConfig);
    onReplicationComplete(() => {
      mapeoCore.sync.destroy(() => origClose.call(server, cb));
    });

    mapServer.stop();
  };

  function onReplicationComplete(cb) {
    // Wait for up to 30 minutes for replication to complete
    const timeoutId = setTimeout(() => {
      mapeoCore.sync.removeListener("down", checkIfDone);
      cb();
    }, 30 * 60 * 1000);

    checkIfDone();

    function checkIfDone() {
      const currentlyReplicatingPeers = mapeoCore.sync
        .peers()
        .filter(
          peer =>
            peer.state &&
            (peer.state.topic === "replication-started" ||
              peer.state.topic === "replication-progress")
        );
      log(currentlyReplicatingPeers.length + " peers still replicating");
      if (currentlyReplicatingPeers.length === 0) {
        clearTimeout(timeoutId);
        return cb();
      }
      mapeoCore.sync.once("down", checkIfDone);
    }
  }

  /**
   * Create an kappa-osm database instance
   *
   * @param {object} options
   * @param {string} options.indexDir Folder for storing leveldb and spatial indexes
   * @param {string} options.feedsDir Folder for storing hypercore feeds
   * @param {string} options.encryptionKey Encryption key for multifeed
   * @returns {object} An object with properties `osm` (an instance of kappa-osm)
   * and `close` (gracefully close all storage and callback)
   */
  function createOsmDb({ indexDir, feedsDir, encryptionKey }) {
    const storages = [];

    const indexDb = level(indexDir);
    indexDb.on("error", err => {
      Bugsnag.notify(err, event => {
        event.severity = "error";
        event.context = "core";
      });
    });

    const coreDb = kappa(feedsDir, {
      valueEncoding: "json",
      encryptionKey,
    });

    // The main osm db for observations and map data
    const osm = createOsmDbOrig({
      core: coreDb,
      index: indexDb,
      storage: createBkdStorage,
    });

    osm.on("error", err => {
      Bugsnag.notify(err, event => {
        event.severity = "error";
        event.context = "core";
      });
    });

    // To close cleanly we need to wait until replication has completed, destroy
    // the discovery swarm, and close all the random-access-storage instances
    // and the leveldb instance
    const close = function close(cb) {
      let pending = storages.length + 2;
      onReplicationComplete(() => {
        // TODO: mapeoCore.close() does not close the underlying hyperlogs or
        // stop indexing in @mapeo/core v8.1.3. This was added in v9 which we
        // are not yet using. When we switch to v9 we can remove the extra
        // cleanup of hypercores and the sync pause here.
        mapeoCore.close(() => {
          mapeoCore.osm.core.pause(() => {
            // This calls multifeed.close() which closes the hypercore feeds
            mapeoCore.osm.core._logs.close(done);
          });
          storages.forEach(storage => {
            storage.close(done);
          });
          indexDb.close(done);
        });
      });
      function done() {
        if (--pending) return;
        log("Closed all storage for kappa-osm");
        cb();
      }
    };

    return { osm, close };

    function createBkdStorage(name, cb) {
      process.nextTick(() => {
        const storage = raf(path.join(indexDir, "bkd", name));
        storages.push(storage);
        cb(null, storage);
      });
    }
  }

  return server;
}

/**
 * Read a projectKey from the metadata.json in the default config path, with a
 * fallback to the project key in the default settings if the user has not added
 * any custom presets
 *
 * @param {object} options
 * @param {string} options.defaultConfigPath
 * @param {string} options.fallbackPresetsDir
 * @returns {string} projectKey
 */
function readProjectKey({ defaultConfigPath, fallbackPresetsDir }) {
  let projectKey;
  try {
    const metadata = JSON.parse(
      fs.readFileSync(path.join(defaultConfigPath, "metadata.json"), "utf8")
    );
    projectKey = metadata.projectKey;
  } catch (err) {
    // if there was an error reading the user presets, try reading a projectKey
    // from the fallback presets
    try {
      const metadata = JSON.parse(
        fs.readFileSync(
          path.join(fallbackPresetsDir, "default", "metadata.json"),
          "utf8"
        )
      );
      projectKey = metadata.projectKey;
    } catch (e) {}
  }
  if (projectKey) {
    log("Found projectKey starting with ", projectKey.slice(0, 4));
  } else {
    log("No projectKey found, using default 'mapeo' key");
  }
  return projectKey;
}
