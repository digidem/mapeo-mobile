const http = require("http");
const path = require("path");
const level = require("level");
const debug = require("debug");

const log = debug("mapeo-core:server");

module.exports = createServer;

function createServer({ privateStorage, sharedStorage }) {
  const db = level(path.join(privateStorage, "db"), {
    valueEncoding: "json"
  });
  const server = http.createServer((req, res) => {
    db.get("test", function(err, value) {
      if (err) log("db get error:", err);
      res.write(JSON.stringify(value, null, 2));
      res.end();
    });
  });
  return server;
}
