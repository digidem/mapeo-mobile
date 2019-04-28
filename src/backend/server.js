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

const log = debug("mapeo-core:server");

module.exports = createServer;

function createServer({ privateStorage, sharedStorage }) {
  const indexDb = level(path.join(privateStorage, "index"));
  const coreDb = kappa(path.join(privateStorage, "db"), {
    valueEncoding: "json"
  });
  function createStorage(name, cb) {
    process.nextTick(
      cb,
      null,
      raf(path.join(privateStorage, "index", "bkd", name))
    );
  }
  // create folders for presets & styles
  mkdirp.sync(path.join(sharedStorage, "presets/default"));
  mkdirp.sync(path.join(sharedStorage, "styles/default"));

  // Folder with default (built-in) presets to server when the user has not
  // added any presets
  const fallbackPresetsDir = path.join(process.cwd(), "presets");

  // The main osm db for observations and map data
  const osm = createOsmDb({
    core: coreDb,
    index: indexDb,
    storage: createStorage,
    deviceType: "mobile"
  });

  // The media store for photos, video etc.
  const media = createMediaStore(path.join(privateStorage, "media"));

  // Handles all other routes for Mapeo
  const mapeoRouter = createMapeoRouter(osm, media, {
    staticRoot: sharedStorage,
    writeFormat: "osm-p2p-syncfile",
    fallbackPresetsDir: fallbackPresetsDir
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

  server.listen = function listen(...args) {
    mapeoCore.sync.listen(() => {
      mapeoCore.sync.on("peer", sendPeerUpdateToRN);
      mapeoCore.sync.on("down", sendPeerUpdateToRN);
      rnBridge.channel.on("sync-start", startSync);
      origListen.apply(server, args);
    });
  };

  // Send message to frontend whenever there is an update to the peer list
  function sendPeerUpdateToRN(peer) {
    const peers = mapeoCore.sync.peers().map(peer => {
      const { connection, ...rest } = peer;
      return rest;
    });
    rnBridge.channel.post("peer-update", peers);
  }

  function startSync(target = {}) {
    if (!target.host || !target.port) return;
    const sync = mapeoCore.sync.replicate(target, { deviceType: "mobile" });
    sync.on("error", onend);
    sync.on("progress", sendPeerUpdateToRN);
    sync.on("end", onend);
    sendPeerUpdateToRN();

    function onend(err) {
      if (err) log(err.message);
      sync.removeListener("error", onend);
      sync.removeListener("progress", sendPeerUpdateToRN);
      sync.removeListener("end", onend);
      sendPeerUpdateToRN();
    }
  }

  server.close = function close(cb) {
    mapeoCore.sync.removeListener("peer", sendPeerUpdateToRN);
    mapeoCore.sync.removeListener("down", sendPeerUpdateToRN);
    rnBridge.channel.removeListener("request-sync", startSync);
    onReplicationComplete(() => {
      mapeoCore.sync.destroy(() => origClose.call(server, cb));
    });
  };

  function onReplicationComplete(cb) {
    // Wait for up to 15 minutes for replication to complete
    const timeoutId = setTimeout(() => {
      mapeoCore.sync.removeListener("down", checkIfDone);
      cb();
    }, 15 * 60 * 1000);

    checkIfDone();

    function checkIfDone() {
      const currentlyReplicatingPeers = mapeoCore.sync
        .peers()
        .filter(
          peer =>
            peer.topic === "replication-started" ||
            peer.topic === "replication-progress"
        );
      if (currentlyReplicatingPeers.length === 0) {
        clearTimeout(timeoutId);
        return cb();
      }
      mapeoCore.sync.once("down", checkIfDone);
    }
  }

  return server;
}
