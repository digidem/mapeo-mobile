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
var test = require("tape");
var path = require("path");
var tapjson = require("tap-json");

const testStream = test.createStream();
const resultStream = testStream.pipe(tapjson());

let results = { stats: "" };
resultStream.on("data", function(res) {
  results = res;
  console.log("passes", res.stats.passes, "failures", res.stats.failures);
});

// The requires need to be explicit here because noderify will statically
// analyze these require calls to create one single index.js file.
require("osm-p2p-db/test/batch");
require("osm-p2p-db/test/changeset");
require("osm-p2p-db/test/create");
require("osm-p2p-db/test/create_db");
require("osm-p2p-db/test/del");
require("osm-p2p-db/test/del_batch");
require("osm-p2p-db/test/del_node");
require("osm-p2p-db/test/del_node_in_way");
require("osm-p2p-db/test/del_relation");
require("osm-p2p-db/test/del_way");
require("osm-p2p-db/test/del_way_in_relation");
require("osm-p2p-db/test/fork");
require("osm-p2p-db/test/fork_count");
require("osm-p2p-db/test/fork_del");
require("osm-p2p-db/test/forked_joins");
require("osm-p2p-db/test/modify_batch");
require("osm-p2p-db/test/modify_way");
require("osm-p2p-db/test/ordered");
require("osm-p2p-db/test/query_way");
require("osm-p2p-db/test/refbug");
require("osm-p2p-db/test/relation");
require("osm-p2p-db/test/relation_bare_ref");
require("osm-p2p-db/test/relation_batch");
require("osm-p2p-db/test/split");
require("osm-p2p-db/test/super_relation");
require("osm-p2p-db/test/super_relation_bare");
require("osm-p2p-db/test/update");

test("last", function(t) {
  t.end();
  testStream.emit("end");
});

http
  .createServer(function(request, response) {
    if (request.url.endsWith("/test")) {
      response.write(JSON.stringify(results.stats));
      response.end();
      return;
    } else {
      console.log("Invalid request:", request);
    }
  })
  .listen(9080);
