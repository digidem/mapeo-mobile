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
const os = require("os");
const path = require("path");
const level = require("level");
const rnBridge = require("rn-bridge");

const ServerStatus = require("./status");
const constants = require("./constants");

const PORT = 9080;
const status = new ServerStatus();
status.startHeartbeat();

process.on("uncaughtException", function(err) {
  status.setState(constants.ERROR);
});

const db = level(path.join(rnBridge.app.datadir(), "db"), {
  valueEncoding: "json"
});

const server = http.createServer((req, res) => {
  db.get("test", function(err, value) {
    if (err) console.log("db get error:", err);
    res.write(JSON.stringify(value, null, 2));
    res.end();
  });
});

rnBridge.channel.on("message", msg => {
  rnBridge.channel.send(msg);
});

// Close the server and pause heartbeat when in background
rnBridge.app.on("pause", pauseLock => {
  status.pauseHeartbeat();
  status.setState(constants.CLOSING);
  server.close(() => {
    status.setState(constants.CLOSED);
    pauseLock.release();
  });
});

// Start things up again when app is back in foreground
rnBridge.app.on("resume", () => {
  status.setState(constants.STARTING);
  status.startHeartbeat();
  start();
});

db.put("test", { foo: "bar", num: 1 }, function(err) {
  if (err) console.log("db put error:", err);
  start();
});

function start() {
  server.listen(PORT, () => status.setState(constants.LISTENING));
  db.get("test", function(err, value) {
    if (err) console.log("db get error:", err);
    rnBridge.channel.send(JSON.stringify(value));
  });
}
