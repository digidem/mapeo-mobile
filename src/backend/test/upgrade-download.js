const path = require("path");
const tmp = require("tmp");
const test = require("tape");
const UpgradeStorage = require("../lib/upgrade-storage");
const UpgradeServer = require("../lib/upgrade-server");
const UpgradeDownload = require("../lib/upgrade-download");
const fs = require("fs");
const http = require("http");
const getport = require("getport");
const collect = require("collect-stream");
const rimraf = require("rimraf");
const net = require("net");

function startServer(cb) {
  getport((err, port) => {
    if (err) return cb(err);

    const dir = tmp.dirSync().name;
    const storage = new UpgradeStorage(dir);
    const server = new UpgradeServer(storage, port);
    const web = http.createServer(function(req, res) {
      if (!server.handleHttpRequest(req, res)) {
        res.statusCode = 404;
        res.end();
      }
    });
    function cleanup() {
      web.close(() => {
        server.drain(() => {
          rimraf.sync(dir);
        });
      });
    }
    web.listen(port, "0.0.0.0", () => {
      cb(null, web, port, server, storage, cleanup);
    });
  });
}

test("can find a compatible upgrade candidate", t => {
  t.plan(4);

  startServer((err, web, port, server, storage, cleanup) => {
    t.error(err);

    const expected = [
      {
        hash:
          "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041",
        hashType: "sha256",
        version: "1.0.0",
        platform: "android",
        arch: ["arm64-v8a"],
        size: 10,
        id: "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041",
        port
      }
    ];

    storage.setApkInfo(
      path.join(__dirname, "static", "fake.apk"),
      "1.0.0",
      err => {
        server.share();

        const download = new UpgradeDownload(storage);
        download.search.start();
        download.once("state", state => {
          delete state.search.context.upgrades[0].host;
          t.equals(state.search.state, 2);
          t.deepEquals(state.search.context.upgrades, expected);

          download.search.stop();
          download.once("state", state => {
            t.equals(state.search.state, 1);
            cleanup();
          });
        });
      }
    );
  });
});

test("will not find an incompatible upgrade candidate", t => {
  t.plan(4);

  startServer((err, web, port, server, storage, cleanup) => {
    t.error(err);
    server.share();

    storage.setApkInfo(
      path.join(__dirname, "static", "fake.apk"),
      "0.5.0",
      err => {
        t.error(err);

        const download = new UpgradeDownload(storage, { version: "2.0.0" });
        download.search.start();

        // HACK: Timeout after 250ms of searching
        setTimeout(() => {
          t.equals(download.state.search.state, 2);
          t.deepEquals(download.state.search.context.upgrades, []);

          download.search.stop();
          cleanup();
        }, 250);
      }
    );
  });
});

test("can find + download an upgrade", t => {
  t.plan(8);

  const expectedHash =
    "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041";
  const expectedData = fs.readFileSync(
    path.join(__dirname, "static", "fake.apk")
  );

  // Client
  const dir2 = tmp.dirSync().name;
  const storage2 = new UpgradeStorage(dir2);
  const download = new UpgradeDownload(storage2, { version: "0.0.0" });

  // Server
  startServer((err, web, port, server, storage, cleanup) => {
    t.error(err, "server started ok");

    server.share();

    const apkPath = path.join(__dirname, "static", "fake.apk");
    storage.setApkInfo(apkPath, "1.0.0", err => {
      t.error(err, "apk info set ok");

      download.search.start();
      download.once("state", state => {
        t.equals(state.search.context.upgrades.length, 1, "upgrade found ok");
        const option = state.search.context.upgrades[0];

        let done = false;
        download.on("state", state => {
          if (done) return;
          if (state.download.state === 3) {
            t.equals(
              state.download.context.filename,
              expectedHash,
              "upgrade downloaded ok"
            );
            done = true;

            storage2.getAvailableUpgrades((err, options) => {
              t.error(err, "got local upgrade options ok");
              t.equals(options.length, 1);

              const rs = storage2.createReadStream(options[0].hash);
              collect(rs, (err, buf) => {
                t.error(err);
                t.ok(buf.equals(expectedData), "data matches");
                download.search.stop();
                cleanup();
              });
            });
          }
        });
        download.download.download(option);
      });
    });
  });
});
