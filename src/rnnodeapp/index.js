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
const path = require('path');
const osm = require('osm-p2p');
const blobstore = require('safe-fs-blob-store');
const Router = require('mapeo-server');
const walk = require('fs-walk');
const os = require('os');
const mkdirp = require('mkdirp');
const styles = require('mapeo-styles');

console.log('1: init');

// NOTE: in the future, we might want separate private keys
// for each user, so let's just have a 'default' user for now so it'll be
// easier to migrate later
const USER_ID = 'default';
const USER_PATH = path.join(os.homedir(), 'mapeo', USER_ID);
const DB_PATH = path.join(USER_PATH, 'db');
const MEDIA_PATH = path.join(USER_PATH, 'media');

// TODO: get user's name, defined in front-end
const HOST = 'Android phone'

const STATIC_PATH = path.join('/sdcard/Android/data/com.mapeomobile/static');

mkdirp.sync(DB_PATH);
mkdirp.sync(MEDIA_PATH);
mkdirp.sync(STATIC_PATH);
console.log('2: dirs created');

// Unpack styles and presets, if needed
styles.unpackIfNew(STATIC_PATH, function(err, didWrite) {
  console.log('3: unpacked', err, didWrite);
  if (err) throw err;
  start();
});

function start() {
  console.log('4: starting');
  const db = osm(DB_PATH);
  const media = blobstore(MEDIA_PATH);

  const route = Router(db, media, {
    host: HOST,
    media: { mode: 'push' },
    staticRoot: STATIC_PATH
  });

  const server = http.createServer((req, res) => {
    if (req.url.endsWith('/ready')) {
      res.write('ready');
      res.end();
      return;
    } else if (route.handle(req, res)) {
    } else {
      res.statusCode = 404;
      res.end('not found\n');
    }
  });

  server.listen(9080, function() {
    console.log('5: server listening');
  });
}
