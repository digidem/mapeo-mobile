const path = require("path");
const tmp = require("tmp");
const test = require("tape");
const UpgradeStorage = require("../lib/upgrade-storage");
const UpgradeServer = require("../lib/upgrade-server");
const UpgradeDownload = require("../lib/upgrade-download");
const fs = require("fs");
const getport = require("getport");
const collect = require("collect-stream");
const rimraf = require("rimraf");

function startServer(opts, cb) {
  if (typeof opts === "function") {
    cb = opts;
    opts = {};
  }

  getport((err, port) => {
    if (err) return cb(err);

    const dir = tmp.dirSync().name;
    const storage = new UpgradeStorage(dir, opts);
    const server = new UpgradeServer(storage, port);
    function cleanup(cb) {
      server.drain(() => {
        rimraf.sync(dir);
        if (cb) cb();
      });
    }
    cb(null, port, server, storage, cleanup);
  });
}

test("can find a compatible upgrade candidate", t => {
  t.plan(5);

  // Client
  const dir2 = tmp.dirSync().name;
  const storage2 = new UpgradeStorage(dir2, { version: "0.0.0" });
  const download = new UpgradeDownload(storage2);

  startServer((err, port, server, storage, cleanup) => {
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
        port,
      },
    ];

    storage.setApkInfo(
      path.join(__dirname, "static", "fake.apk"),
      "1.0.0",
      err => {
        t.error(err, "set apk info ok");
        server.share();

        download.start();
        download.on("state", state => {
          if (state.search.state !== "SEARCHING") return;
          delete state.search.context.upgrades[0].host;
          t.equals(state.search.state, "SEARCHING", "searching state ok");
          scrub(state.search.context.upgrades);
          t.deepEquals(state.search.context.upgrades, expected, "upgrade ok");

          download.stop();
          download.once("state", state => {
            t.equals(state.search.state, "IDLE", "idle state ok");
            cleanup();
          });
        });
      }
    );
  });
});

test("will not find an incompatible upgrade candidate", t => {
  t.plan(4);

  startServer({ version: "2.0.0" }, (err, port, server, storage, cleanup) => {
    t.error(err);
    server.share();

    storage.setApkInfo(
      path.join(__dirname, "static", "fake.apk"),
      "0.5.0",
      err => {
        t.error(err);

        const download = new UpgradeDownload(storage);
        download.start();

        // HACK: Timeout after 250ms of searching
        setTimeout(() => {
          t.equals(download.state.search.state, "SEARCHING");
          t.deepEquals(download.state.search.context.upgrades, []);

          download.stop();
          cleanup();
        }, 250);
      }
    );
  });
});

test("can find + download + check an upgrade", t => {
  t.plan(11);

  const expectedHash =
    "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041";
  const expectedData = fs.readFileSync(
    path.join(__dirname, "static", "fake.apk")
  );

  // Client
  const dir2 = tmp.dirSync().name;
  const storage2 = new UpgradeStorage(dir2);
  const download = new UpgradeDownload(storage2);

  // Server
  startServer((err, port, server, storage, cleanup) => {
    t.error(err, "server started ok");

    server.share();

    const apkPath = path.join(__dirname, "static", "fake.apk");
    storage.setApkInfo(apkPath, "1.0.0", err => {
      t.error(err, "apk info set ok");

      awaitFoundUpgrade(() => {
        awaitDownloaded(() => {
          awaitChecked();
        });
      });

      function awaitFoundUpgrade(cb) {
        download.start();

        download.once("state", state => {
          t.equals(state.search.context.upgrades.length, 1, "upgrade found ok");
          const option = state.search.context.upgrades[0];
          download.download(option);
          cb();
        });
      }

      function awaitDownloaded(cb) {
        let done = false;
        let lastProgress = null;
        download.on("state", onState);

        function onState(state) {
          if (done) return;
          if (state.download.state === "DOWNLOADING") {
            lastProgress = state.download.context;
          }
          if (state.download.state === "IDLE") {
            t.equals(lastProgress.sofar, 10, "final sofar progress ok");
            t.equals(lastProgress.total, 10, "final total progress ok");
            done = true;
            download.removeListener("state", onState);
            cb();
          }
        }
      }

      function awaitChecked() {
        let done = false;
        download.on("state", state => {
          if (done || state.check.state !== "AVAILABLE") return;
          done = true;
          t.equals(state.check.state, "AVAILABLE", "check state is AVAILABLE");
          t.equals(
            path.basename(state.check.context.filename),
            expectedHash,
            "hash is ok"
          );

          storage2.getAvailableUpgrades((err, options) => {
            t.error(err, "got local upgrade options ok");
            scrub(options);
            t.equals(options.length, 1, "# of upgrades is ok");

            const rs = storage2.createReadStream(options[0].hash);
            collect(rs, (err, buf) => {
              t.error(err, "streamed upgrade data ok");
              t.ok(buf.equals(expectedData), "data matches ok");
              download.stop();
              cleanup();
            });
          });
        });
      }
    });
  });
});

test("REGRESSION: a local upgrade equal to app version is not shown", t => {
  t.plan(11);

  const expectedHash =
    "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041";
  const expectedData = fs.readFileSync(
    path.join(__dirname, "static", "fake.apk")
  );

  // Client
  const dir2 = tmp.dirSync().name;
  const storage2 = new UpgradeStorage(dir2);
  const download = new UpgradeDownload(storage2);

  // Server
  startServer((err, port, server, storage, cleanup) => {
    t.error(err, "server started ok");

    server.share();

    const apkPath = path.join(__dirname, "static", "fake.apk");
    storage.setApkInfo(apkPath, "1.0.0", err => {
      t.error(err, "apk info set ok");

      awaitFoundUpgrade(() => {
        awaitDownloaded(() => {
          awaitChecked();
        });
      });

      function awaitFoundUpgrade(cb) {
        download.start();
        download.once("state", state => {
          t.equals(state.search.context.upgrades.length, 1, "upgrade found ok");
          const option = state.search.context.upgrades[0];
          download.download(option);
          cb();
        });
      }

      function awaitDownloaded(cb) {
        let done = false;
        let lastProgress = null;
        download.on("state", onState);

        function onState(state) {
          if (done) return;
          if (state.download.state === "DOWNLOADING") {
            lastProgress = state.download.context;
          }
          if (state.download.state === "IDLE") {
            t.equals(lastProgress.sofar, 10);
            t.equals(lastProgress.total, 10);
            done = true;
            download.removeListener("state", onState);
            cb();
          }
        }
      }

      function awaitChecked() {
        let done = false;
        download.on("state", state => {
          if (done || state.check.state !== "AVAILABLE") return;
          done = true;
          t.equals(state.check.state, "AVAILABLE");
          t.equals(path.basename(state.check.context.filename), expectedHash);

          storage2.getAvailableUpgrades((err, options) => {
            t.error(err, "got local upgrade options ok");
            scrub(options);
            t.equals(options.length, 1);

            const rs = storage2.createReadStream(options[0].hash);
            collect(rs, (err, buf) => {
              t.error(err);
              t.ok(buf.equals(expectedData), "data matches");
              download.stop();
              cleanup();
            });
          });
        });
      }
    });
  });
});

test("candidate replaced if peer with an upgrade goes down + another appears", t => {
  t.plan(14);

  // Peer 1
  startServer((err, port, server, storage, cleanup) => {
    t.error(err, "server 1 started ok");

    // Peer 2
    const dir2 = tmp.dirSync().name;
    const storage2 = new UpgradeStorage(dir2);
    const download2 = new UpgradeDownload(storage2);

    server.share();

    const apkPath = path.join(__dirname, "static", "fake.apk");
    const apkPath2 = path.join(__dirname, "static", "fake2.apk");
    storage.setApkInfo(apkPath, "10.0.0", err => {
      t.error(err, "apk info set ok");

      // End Peer 2 once found, then restart it
      awaitFoundUpgrade((err, options) => {
        t.error(err, "found upgrade candidate ok");
        t.equals(options.length, 1, "1 upgrade found ok");
        t.equals(
          options[0].hash,
          "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041",
          "upgrade hash matches ok"
        );
        cleanup(() => {
          t.pass("cleaned up old server ok");
          startServer((err, port, server, storage, cleanup) => {
            t.error(err, "server 2 started ok");
            storage.setApkInfo(apkPath2, "10.0.0", err => {
              t.error(err, "apk info set ok");
              server.share();
              const ix = setTimeout(() => {
                t.fail("unable to find new upgrade candidate");
                cleanup();
                download2.stop();
              }, 3000);
              awaitFoundUpgrade((err, options2) => {
                clearTimeout(ix);
                t.error(err, "found 2nd upgrade candidate ok");
                t.equals(options2.length, 2, "# of upgrades ok");
                t.equals(
                  options2[1].hash,
                  "3209efeebdbaa5b3faab4df9312d03831092ce71b497235953b7252e78651111",
                  "hash 1 ok"
                );
                t.equals(
                  options2[0].hash,
                  "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041",
                  "hash 2 ok"
                );
                cleanup();
                download2.stop();
              });
            });
          });
        });
      });

      function awaitFoundUpgrade(cb) {
        download2.start();
        download2.once("state", state => {
          t.equals(state.search.state, "SEARCHING");
          cb(null, state.search.context.upgrades);
        });
      }
    });
  });
});

// Wipes the 'filename' property.
function scrub(options) {
  options.forEach(o => delete o.filename);
}
