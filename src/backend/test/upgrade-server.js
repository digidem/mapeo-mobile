const path = require("path");
const tmp = require("tmp");
const test = require("tape");
const UpgradeStorage = require("../lib/upgrade-storage");
const UpgradeServer = require("../lib/upgrade-server");
const fs = require("fs");
const http = require("http");
const getport = require("getport");
const collect = require("collect-stream");
const rimraf = require("rimraf");
const net = require("net");
const pump = require("pump");
const through = require("through2");

function startServer(cb) {
  getport((err, port) => {
    if (err) return cb(err);

    const dir = tmp.dirSync().name;
    const storage = new UpgradeStorage(dir);
    const server = new UpgradeServer(storage, port);
    function cleanup() {
      server.drain(() => {
        rimraf.sync(dir);
      });
    }
    cb(null, port, server, storage, cleanup);
  });
}

test("can start + make request against server", t => {
  t.plan(2);

  startServer((err, port, server, storage, cleanup) => {
    t.error(err);
    server.share();
    http.get({ hostname: "localhost", port, path: "/should-404" }, res => {
      t.equals(res.statusCode, 404);
      cleanup();
    });
  });
});

test("route: empty GET /list result", t => {
  t.plan(4);

  startServer((err, port, server, storage, cleanup) => {
    t.error(err);
    server.share();
    http.get({ hostname: "localhost", port, path: "/list" }, res => {
      t.equals(res.statusCode, 200);
      collect(res, (err, buf) => {
        t.error(err);
        try {
          const data = JSON.parse(buf.toString());
          t.deepEquals(data, []);
          cleanup();
        } catch (err) {
          t.error(err);
        }
      });
    });
  });
});

test("route: GET /list APK result", t => {
  t.plan(5);

  const expected = [
    {
      hash: "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041",
      hashType: "sha256",
      version: "1.0.0",
      platform: "android",
      arch: ["arm64-v8a"],
      size: 10,
      id: "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041",
    },
  ];

  startServer((err, port, server, storage, cleanup) => {
    t.error(err);
    server.share();
    storage.setApkInfo(
      path.join(__dirname, "static", "fake.apk"),
      "1.0.0",
      err => {
        t.error(err);
        http.get({ hostname: "localhost", port, path: "/list" }, res => {
          t.equals(res.statusCode, 200);
          collect(res, (err, buf) => {
            t.error(err);
            try {
              const data = JSON.parse(buf.toString());
              t.deepEquals(data, expected);
              cleanup();
            } catch (err) {
              t.error(err);
            }
          });
        });
      }
    );
  });
});

test("route: empty GET /content/X result", t => {
  t.plan(2);

  startServer((err, port, server, storage, cleanup) => {
    t.error(err);
    server.share();
    http.get(
      { hostname: "localhost", port, path: "/content/bad-hash" },
      res => {
        t.equals(res.statusCode, 404);
        cleanup();
      }
    );
  });
});

test("route: APK GET /content/X result", t => {
  t.plan(5);

  const expectedHash =
    "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041";
  const expectedData = fs.readFileSync(
    path.join(__dirname, "static", "fake.apk")
  );

  startServer((err, port, server, storage, cleanup) => {
    t.error(err);
    server.share();
    const apkPath = path.join(__dirname, "static", "fake.apk");
    storage.setApkInfo(apkPath, "1.0.0", err => {
      t.error(err);
      const opts = {
        hostname: "localhost",
        port,
        path: `/content/${expectedHash}`,
      };
      http.get(opts, res => {
        t.equals(res.statusCode, 200);
        collect(res, (err, buf) => {
          t.error(err);
          t.ok(buf.equals(expectedData), "data matches");
          cleanup();
        });
      });
    });
  });
});

test("make an http request before 'share' is called", t => {
  t.plan(3);

  startServer((err, port, server, storage, cleanup) => {
    t.error(err);
    http
      .get({ hostname: "localhost", port, path: "/list" }, res => {
        t.fail("unexpected GET success");
      })
      .once("error", err => {
        t.ok(err, "error ok");
        t.equals(err.code, "ECONNREFUSED");
        cleanup();
      });
  });
});

test("make an http request while draining", t => {
  t.plan(5);

  const apkPath = tmp.fileSync().name;
  fs.writeFileSync(apkPath, Buffer.alloc(15000000).fill(127));
  const expectedHash =
    "864338384f218b0b7b24b0db0d5f9fc7904c953f1b9dcdc8376648499d8dc943";

  startServer((err, port, server, storage, cleanup) => {
    t.error(err);
    server.share();
    storage.setApkInfo(apkPath, "1.0.0", err => {
      t.error(err);

      const socket = makeDanglingHttpGet(port, `/content/${expectedHash}`);

      setTimeout(() => {
        server.drain();

        const opts = {
          hostname: "localhost",
          port,
          path: `/content/${expectedHash}`,
        };
        http
          .get(opts, res => {
            collect(res, (err, buf) => {
              t.error(err);
              t.equals(res.statusCode, 503);
              t.equals(buf.toString(), '"service unavailable"');

              socket.once("close", () => {
                rimraf.sync(apkPath);
                cleanup();
              });
              socket.unclog();
              socket.end();
            });
          })
          .once("error", err => {
            t.error(err, "should not happen");
          });
      }, 100);
    });
  });
});

function makeDanglingHttpGet(port, route) {
  const socket = net.connect({ host: "0.0.0.0", port });
  socket.write(`GET ${route} HTTP/1.1\n\n`);

  let clogged = true;
  let nextFn;
  socket.accumBytes = 0;
  socket.unclog = function () {
    clogged = false;
    nextFn();
  };

  pump(
    socket,
    through((chunk, enc, next) => {
      socket.accumBytes += chunk.length;
      if (clogged) nextFn = next;
      else next();
    })
  );

  return socket;
}
