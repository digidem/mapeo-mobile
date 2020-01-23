const http = require("http");
const path = require("path");
const level = require("level");
const kappa = require("kappa-core");
const raf = require("random-access-file");
const createOsmDb = require("kappa-osm");
const createMediaStore = require("safe-fs-blob-store");
const createMapeoRouter = require("mapeo-server");
const debug = require("debug");
const mkdirp = require("mkdirp");
const rnBridge = require("rn-bridge");
const throttle = require("lodash/throttle");
const main = require("./index");
const fs = require("fs");
const tar = require("tar-fs");
const pump = require("pump");
const tmp = require("tmp");
const semverCoerce = require("semver/functions/coerce");
const semverMajor = require("semver/functions/major");

// Cleanup the temporary files even when an uncaught exception occurs
tmp.setGracefulCleanup();

const log = debug("mapeo-core:server");

module.exports = createServer;

function createServer({ privateStorage, sharedStorage }) {
  let projectKey;
  const defaultConfigPath = path.join(sharedStorage, "presets/default");

  try {
    const metadata = JSON.parse(
      fs.readFileSync(path.join(defaultConfigPath, "metadata.json"), "utf8")
    );
    projectKey = metadata.projectKey;
    if (projectKey)
      log("Found projectKey starting with ", projectKey.slice(0, 4));
    else log("No projectKey found, using default 'mapeo' key");
  } catch (err) {
    // An undefined projectKey is fine, the fallback is to sync with any other mapeo
    log("No projectKey found, using default 'mapeo' key");
  }
  const indexDb = level(path.join(privateStorage, "index"));
  const coreDb = kappa(path.join(privateStorage, "db"), {
    valueEncoding: "json",
    encryptionKey: projectKey
  });
  function createStorage(name, cb) {
    process.nextTick(
      cb,
      null,
      raf(path.join(privateStorage, "index", "bkd", name))
    );
  }
  // create folders for presets & styles
  mkdirp.sync(defaultConfigPath);
  mkdirp.sync(path.join(sharedStorage, "styles/default"));

  // Folder with default (built-in) presets to server when the user has not
  // added any presets
  const fallbackPresetsDir = path.join(process.cwd(), "presets");

  // The main osm db for observations and map data
  const osm = createOsmDb({
    core: coreDb,
    index: indexDb,
    storage: createStorage
  });

  // The media store for photos, video etc.
  const media = createMediaStore(path.join(privateStorage, "media"));

  // Handles all other routes for Mapeo
  const mapeoRouter = createMapeoRouter(osm, media, {
    staticRoot: sharedStorage,
    writeFormat: "osm-p2p-syncfile",
    fallbackPresetsDir: fallbackPresetsDir,
    deviceType: "mobile"
  });
  const mapeoCore = mapeoRouter.api.core;

  const server = http.createServer(function requestListener(req, res) {
    log(req.method + ": " + req.url);
    // Check if the route is handled by Mapeo Server
    var match = mapeoRouter.handle(req, res);

    // If not and headers are not yet sent, send a 404 error
    if (!match && !res.headersSent) {
      res.statusCode = 404;
      const error = {
        code: 404,
        message: "NotFound"
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

  server.listen = function listen(...args) {
    mapeoCore.sync.listen(() => {
      mapeoCore.sync.on("peer", throttledSendPeerUpdateToRN);
      mapeoCore.sync.on("down", throttledSendPeerUpdateToRN);
      rnBridge.channel.on("sync-start", startSync);
      rnBridge.channel.on("sync-join", joinSync);
      rnBridge.channel.on("sync-leave", leaveSync);
      rnBridge.channel.on("replace-config", replaceConfig);
      origListen.apply(server, args);
    });
  };

  // Given a config tarball at `path`, replace the current config.
  function replaceConfig({ id, path: pathToNewConfigTarball }) {
    const cb = err => rnBridge.channel.post("replace-config-" + id, err);

    tmp.dir(
      {
        unsafeCleanup: true,
        // NB: os.tmp() is in private cache storage on Android, but currently
        // the destination is in sharedStorage. We can't fs.rename() between
        // these two storage areas, so we create our own temp dir in
        // sharedStorage
        dir: sharedStorage
      },
      (err, tmpDir, cleanup) => {
        // 1 - extract to temp directory
        if (err) {
          log("Could not create tmp directory for config extract", err);
          return cb(err);
        }
        log("Creating in temp import path: " + tmpDir);
        var source = fs.createReadStream(pathToNewConfigTarball);
        var dest = tar.extract(tmpDir, {
          readable: true,
          writable: true
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
            if (parsedVersion.major > 2 || parsedVersion.major < 2) {
              log(
                "Mapeo is not compatible with this config version (" +
                  version +
                  ")"
              );
              cb(new Error("Incompatible config version"));
            }
            log("Importing config version: " + version);
            onVersionCheck();
          });
        }

        // 3 - Presets look ok, replace current presets with these
        function onVersionCheck() {
          fs.rename(tmpDir, defaultConfigPath, err => {
            if (err) {
              log("Error replacing existing config with new config", err);
              return cb(err);
            }
            // Manual cleanup of temp dir - tmp should cleanup on node exist, but
            // just in case
            cleanup();
            cb();
          });
        }
      }
    );
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
          : undefined
      };
    });
    rnBridge.channel.post("peer-update", peers);
  }

  function startSync(target = {}) {
    if (!target.host || !target.port) return;
    const startTime = Date.now();
    const sync = mapeoCore.sync.replicate(target, { deviceType: "mobile" });
    sync.on("error", onerror);
    sync.on("progress", throttledSendPeerUpdateToRN);
    sync.on("end", onend);
    sendPeerUpdateToRN();

    function onerror(err) {
      main.bugsnag.notify(err, {
        severity: "error",
        context: "sync"
      });
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

  function joinSync({ deviceName } = {}) {
    try {
      if (deviceName) mapeoCore.sync.setName(deviceName);
      log("Joining swarm", projectKey && projectKey.slice(0, 4));
      mapeoCore.sync.join(projectKey);
    } catch (e) {
      main.bugsnag.notify(e, {
        severity: "error",
        context: "sync join"
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
        context: "sync leave"
      });
    }
  }

  server.close = function close(cb) {
    mapeoCore.sync.removeListener("peer", throttledSendPeerUpdateToRN);
    mapeoCore.sync.removeListener("down", throttledSendPeerUpdateToRN);
    rnBridge.channel.removeListener("sync-start", startSync);
    rnBridge.channel.removeListener("sync-join", joinSync);
    rnBridge.channel.removeListener("sync-leave", leaveSync);
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

  return server;
}
