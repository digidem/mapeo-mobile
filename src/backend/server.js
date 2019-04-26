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
    storage: createStorage
  });

  // The media store for photos, video etc.
  const media = createMediaStore(path.join(privateStorage, "media"));

  // Handles all other routes for Mapeo
  const mapeoRouter = createMapeoRouter(osm, media, {
    staticRoot: sharedStorage,
    writeFormat: "osm-p2p-syncfile",
    fallbackPresetsDir: fallbackPresetsDir
  });

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

  return server;
}
