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
const blobstore = require('fs-blob-store');
const Router = require('mapeo-server');
const os = require('os');
const mkdirp = require('mkdirp');

const USER_PATH = path.join(os.homedir(), 'mapeo', 'default');
const DB_PATH = path.join(USER_PATH, 'db');
const MEDIA_PATH = path.join(USER_PATH, 'media');
mkdirp.sync(DB_PATH);
mkdirp.sync(MEDIA_PATH);

const db = osm(DB_PATH);
const media = blobstore(MEDIA_PATH);

const route = Router(db, media);

const server = http.createServer((req, res) => {
  if (route.handle(req, res)) {
  } else {
    res.statusCode = 404;
    res.end('not found\n');
  }
});

server.listen(9080);
