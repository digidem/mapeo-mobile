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
const throttle = require("lodash/throttle");
const main = require("./index");
const fs = require("fs");
const rimraf = require("rimraf");
const tar = require("tar-fs");
const pump = require("pump");
const tmp = require("tmp");
const semverCoerce = require("semver/functions/coerce");

// Cleanup the temporary files even when an uncaught exception occurs
tmp.setGracefulCleanup();

const log = debug("mapeo-core:server");

module.exports = createServer;

function createServer({ privateStorage, sharedStorage, flavor }) {
  const defaultConfigPath = path.join(sharedStorage, "presets/default");
  log("Creating server");

  // Folder with default (built-in) presets to server when the user has not
  // added any presets
  const fallbackPresetsDir = path.join(privateStorage, "nodejs-assets/presets");

  // create folders for presets & styles
  mkdirp.sync(defaultConfigPath);
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
      main.bugsnag.notify(err, {
        severity: "error",
        context: "sync",
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
      rnBridge.channel.on("sync-connect-cloud", connectCloud);
      rnBridge.channel.on("replace-config", replaceConfig);
      origListen.apply(server, args);
    });
  };

  function connectCloud({ url }) {
    if (!projectKey)
      return console.warn("Must have project key to do sync to mapeo-web");
    mapeoCore.sync.connectWebsocket(url, projectKey);
  }

  // Given a config tarball at `path`, replace the current config.
  function replaceConfig({ id, path: pathToNewConfigTarball }) {
    const cb = err =>
      rnBridge.channel.post("replace-config-" + id, err && err.message);

    tmp.dir(
      {
        unsafeCleanup: true,
        // NB: os.tmp() is in private cache storage on Android, but currently
        // the destination is in sharedStorage. We can't fs.rename() between
        // these two storage areas, so we create our own temp dir in
        // sharedStorage
        dir: sharedStorage,
      },
      (err, tmpDir, cleanup) => {
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
              // Manual cleanup of temp dir - tmp should cleanup on node exist, but
              // just in case
              cleanup();
              onChangeConfig();
            });
          });
        }
      }
    );

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
      main.bugsnag.notify(e, {
        severity: "error",
        context: "sync join",
      });
    }
  }

  function leaveSync() {
    try {
      log("Leaving swarm", projectKey && projectKey.slice(0, 4));
      mapeoCore.sync.leave(projectKey);
    } catch (e) {
      main.bugsnag.notify(e, {
        severity: "error",
        context: "sync leave",
      });
    }
  }

  server.close = function close(cb) {
    mapeoCore.sync.removeListener("peer", onNewPeer);
    mapeoCore.sync.removeListener("down", throttledSendPeerUpdateToRN);
    rnBridge.channel.removeListener("sync-start", startSync);
    rnBridge.channel.removeListener("sync-join", joinSync);
    rnBridge.channel.removeListener("sync-leave", leaveSync);
    rnBridge.channel.removeListener("sync-connect", connectCloud);
    rnBridge.channel.removeListener("replace-config", replaceConfig);
    onReplicationComplete(() => {
      mapeoCore.sync.destroy(() => origClose.call(server, cb));
    });
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
      main.bugsnag.notify(err, {
        severity: "error",
        context: "core",
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
