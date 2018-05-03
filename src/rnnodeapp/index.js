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

const http = require('http');
const hyperlog = require('hyperlog');
const level = require('level');
const fdstore = require('fd-chunk-store');
const osmdb = require('osm-p2p-db');
const osmrouter = require('osm-p2p-server');
const getGeoJSON = require('osm-p2p-geojson');
const mkdirp = require('mkdirp');
const path = require('path');
const os = require('os');
const url = require('url');
const fs = require('fs');
const Osm = require('osm-p2p');
const blobstore = require('fs-blob-store');
const Router = require('mapeo-mobile-server');

const osm = Osm('./db');
const media = blobstore('./media');

const route = Router(osm, media);

const server = http.createServer((req, res) => {
  const fn = route(req, res);
  if (fn) {
    fn();
  } else {
    res.statusCode = 404;
    res.end('not found\n');
  }
});
server.listen(5000);

// const osmdbPath = path.resolve(os.homedir(), 'osm-p2p');
// const mapeoPath = path.resolve(os.homedir(), 'rnnodeapp', 'mapeo');
//
// mkdirp.sync(osmdbPath);
//
// const db = {
//   log: level(`${osmdbPath}/log`),
//   index: level(`${osmdbPath}/index`)
// };
//
// const osm = osmdb({
//   log: hyperlog(db.log, { valueEncoding: 'json' }),
//   db: db.index,
//   store: fdstore(4096, `${osmdbPath}/kdb`)
// });
//
// const router = osmrouter(osm);
