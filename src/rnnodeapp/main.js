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

const http = require("http");
const hyperlog = require("hyperlog");
const level = require("level");
const fdstore = require("fd-chunk-store");
const osmdb = require("osm-p2p-db");
const osmrouter = require("osm-p2p-server");

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

const router = osmrouter(osm);

http
  .createServer(function(request, response) {
    if (router.handle(request, response)) {
      return;
    }
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
          response.write(JSON.stringify(pts));
          response.end();
        }
      });
    } else {
      console.log("Invalid request:", request);
    }
  })
  .listen(9080);
