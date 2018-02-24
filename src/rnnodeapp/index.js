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

const osmdbPath = path.resolve(os.homedir(), 'osm-p2p');

mkdirp.sync(osmdbPath);

const db = {
  log: level(`${osmdbPath  }/log`),
  index: level(`${osmdbPath  }/index`)
};

const osm = osmdb({
  log: hyperlog(db.log, { valueEncoding: 'json' }),
  db: db.index,
  store: fdstore(4096, `${osmdbPath  }/kdb`)
});

const router = osmrouter(osm);

http
  .createServer((request, response) => {
    if (request.url.endsWith('/geojson')) {
      const q = [[-Infinity, Infinity], [-Infinity, Infinity]];
      osm.query(q, (err, docs) => {
        getGeoJSON(osm, { docs }, (err, geojson) => {
          response.write(JSON.stringify(geojson));
          response.end();
        });
      });
      return;
    }

    if (router.handle(request, response)) {
      return;
    }

    if (request.url.endsWith('/ping')) {
      response.write('pong');
      response.end();
      return;
    }

    if (request.url.endsWith('/create')) {
      const node = {
        type: 'node',
        lat: 64 + Math.random(),
        lon: -148 + Math.random(),
        tags: { foo: 'bar' }
      };
      osm.create(node, (err, key, node) => {
        if (err) console.error(err);
        else console.log(key);
      });
      response.writeHead(200);
      response.end();
      return;
    }

    if (request.url.endsWith('/query')) {
      const q = [[-Infinity, Infinity], [-Infinity, Infinity]];
      osm.query(q, (err, pts) => {
        if (err) console.error(err);
        else {
          response.write(JSON.stringify(pts));
          response.end();
        }
      });
      return;
    }

    console.warn('Invalid request:', request);
  })
  .listen(9080);
