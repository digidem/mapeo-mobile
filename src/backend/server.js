const http = require("http");
const path = require("path");
const level = require("level");
const kappa = require("kappa-core");
const raf = require("random-access-file");
const createOsmDb = require("kappa-osm");
const createMediaStore = require("safe-fs-blob-store");
const createOsmRouter = require("osm-p2p-server");
const createMapeoRouter = require("mapeo-server");

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

  // The main osm db for observations and map data
  const osm = createOsmDb({
    core: coreDb,
    index: indexDb,
    storage: createStorage
  });

  // The media store for photos, video etc.
  const media = createMediaStore(path.join(privateStorage, "media"));

  // Handles requests for the standard OSM API v0.6 routes
  const osmRouter = createOsmRouter(osm);

  // Handles all other routes for Mapeo
  const mapeoRouter = createMapeoRouter(osm, media, {
    staticRoot: path.join(sharedStorage, "static"),
    writeFormat: "osm-p2p-syncfile"
  });

  const server = http.createServer(function requestListener(req, res) {
    // Check if the route is handled by OSM API or Mapeo Server
    var match = osmRouter.handle(req, res) || mapeoRouter.handle(req, res);

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
