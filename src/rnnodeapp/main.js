const http = require("http");
const hyperlog = require("hyperlog");
const level = require("level");
const fdstore = require("fd-chunk-store");
const osmdb = require("osm-p2p-db");

const db = {
  log: level("/tmp/osm-p2p/log"),
  index: level("/tmp/osm-p2p/index")
};
const storefile = "/tmp/osm-p2p/kdb";

const osm = osmdb({
  log: hyperlog(db.log, { valueEncoding: "json" }),
  db: db.index,
  store: fdstore(4096, storefile)
});

http
  .createServer(function(request, response) {
    if (request.url.endsWith("/ping")) {
      response.write("pong");
      response.end();
      return;
    }
    if (request.url.endsWith("/create")) {
      const node = {
        type: "node",
        lat: 64 + Math.random(),
        lon: -148 + Math.random()
      };
      osm.create(node, function(err, key, node) {
        if (err) console.error(err);
        else console.log(key);
      });
      response.writeHead(200);
      response.end();
      return;
    }
    if (request.url.endsWith("/query")) {
      console.log("got /query request");
      const q = [[60, 70], [-200, -100]];
      osm.query(q, function(err, pts) {
        console.log("query finished");
        if (err) console.error(err);
        else {
          response.write(JSON.stringify(pts))
          response.end();
        }
      });
    }
  })
  .listen(9080);
