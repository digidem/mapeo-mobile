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

function startServer(cb) {
  getport((err, port) => {
    if (err) return cb(err);

    const dir = tmp.dirSync().name;
    const storage = new UpgradeStorage(dir);
    const server = new UpgradeServer(storage);
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
    web.listen(port, "localhost", () => {
      cb(null, web, port, server, storage, cleanup);
    });
  });
}

test("can start + make request against server", t => {
  t.plan(2);

  startServer((err, web, port, server, storage, cleanup) => {
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

  startServer((err, web, port, server, storage, cleanup) => {
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
      id: "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041"
    }
  ];

  startServer((err, web, port, server, storage, cleanup) => {
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

  startServer((err, web, port, server, storage, cleanup) => {
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

  startServer((err, web, port, server, storage, cleanup) => {
    t.error(err);
    server.share();
    const apkPath = path.join(__dirname, "static", "fake.apk");
    storage.setApkInfo(apkPath, "1.0.0", err => {
      t.error(err);
      const opts = {
        hostname: "localhost",
        port,
        path: `/content/${expectedHash}`
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
  t.plan(4);

  startServer((err, web, port, server, storage, cleanup) => {
    t.error(err);
    http.get({ hostname: "localhost", port, path: "/list" }, res => {
      t.equals(res.statusCode, 503);
      collect(res, (err, buf) => {
        t.error(err);
        t.equals(buf.toString(), '"service unavailable"');
        cleanup();
      });
    });
  });
});

test("make an http request while draining", t => {
  t.plan(7);

  const expectedHash =
    "78ad74cecb99d1023206bf2f7d9b11b28767fbb9369daa0afa5e4d062c7ce041";

  startServer((err, web, port, server, storage, cleanup) => {
    t.error(err);
    server.share();
    const apkPath = path.join(__dirname, "static", "fake.apk");
    storage.setApkInfo(apkPath, "1.0.0", err => {
      t.error(err);

      const socket = makeDanglingHttpGet(port, `/content/${expectedHash}`);
      collect(socket, (err, buf) => {
        t.error(err);
        t.ok(/fake data/.test(buf.toString()));
        cleanup();
      });

      setTimeout(() => {
        server.drain();

        const opts = {
          hostname: "localhost",
          port,
          path: `/content/${expectedHash}`
        };
        http.get(opts, res => {
          collect(res, (err, buf) => {
            t.error(err);
            t.equals(res.statusCode, 503);
            t.equals(buf.toString(), '"service unavailable"');
            socket.end();
            cleanup();
          });
        });
      }, 100);
    });
  });
});

function makeDanglingHttpGet(port, route) {
  const socket = net.connect({ host: "0.0.0.0", port });
  socket.write(`GET ${route} HTTP 1.1\n\n`);
  socket.resume();
  return socket;
}
