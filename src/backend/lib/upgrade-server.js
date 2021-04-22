const pump = require("pump");
const discovery = require("dns-discovery");
const EventEmitter = require("events").EventEmitter;
const RWLock = require("rwlock");
const through = require("through2");
const http = require("http");
const { DISCOVERY_KEY, UpgradeState } = require("./constants");
const log = require("debug")("p2p-upgrades:server");

/*
type Uploads = [UploadInfo]

type UploadInfo = {
  sofar: Number,
  total: Number
}
*/

class UpgradeServer extends EventEmitter {
  constructor(storage, port) {
    super();
    this.storage = storage;
    this.stateLock = new RWLock();
    this.state = null;
    this.context = null;
    this.setState(UpgradeState.Server.Idle, null);
    this.port = port;
    this.server = http.createServer((req, res) => {
      log("got http request", req.url, req.headers.host);
      if (!this.handleHttpRequest(req, res)) {
        log("invalid route", req.url);
        res.statusCode = 404;
        res.end();
      }
    });
    this.announceInterval = null;

    // In-progress uploads
    this.uploads = [];
  }

  // XXX: public; also no concurrency guards!
  setState(to, context) {
    this.state = to;
    this.context = context;
    this.emit("state", this.state, this.context);
  }

  // Callback<Void> -> Void
  share(cb) {
    this.stateLock.writeLock(release => {
      const self = this;
      function done(err) {
        if (err) self.setState(UpgradeState.Server.Error, err);
        release();
        if (cb) cb(err);
      }

      if (this.state !== UpgradeState.Server.Idle) {
        log("tried to share() when not in idle state");
        return done();
      }

      log("starting discovery..");
      const opts = {
        server: [],
        loopback: false,
      };
      this.discovery = discovery(opts);
      this.server.listen(this.port, "0.0.0.0", () => {
        log("announcing on", DISCOVERY_KEY);
        this.announceInterval = setInterval(() => {
          this.discovery.announce(DISCOVERY_KEY, this.port);
        }, 2000);
        this.setState(UpgradeState.Server.Sharing, this.uploads);
        done();
      });
    });
  }

  // Callback<Void> -> Void
  drain(cb) {
    this.stateLock.writeLock(release => {
      const self = this;
      function done(err) {
        // Ignorable. this only fires if discovery.destroy() errors, which is fine
        if (err) self.setState(UpgradeState.Server.Error, err);
        release();
        if (cb) cb(err);
      }

      if (this.state !== UpgradeState.Server.Sharing) {
        log("tried to drain() when not in share state");
        return done();
      }

      this.setState(UpgradeState.Server.Draining, this.uploads);
      if (this.uploads.length === 0) {
        log("drain: no current uploads; stopping immediately");
        return stop.bind(this)();
      }

      // wait for all uploads to finish
      log(`drain: waiting for ${this.uploads.length} uploads to finish`);
      release();
      this.on("upload-complete", oncomplete.bind(this));
      function oncomplete() {
        if (this.uploads.length === 0) {
          log("drain: no uploads left; stopping now");
          this.removeListener("upload", oncomplete);
          stop.call(this);
        } else {
          log(
            `drain: still waiting for ${this.uploads.length} uploads to finish`
          );
        }
      }

      function stop() {
        log("drain: stopping..");

        clearInterval(this.announceInterval);
        this.announceInterval = null;

        // XXX: 'unannounce' seems to always return an error here; ignoring.
        this.discovery.unannounce(DISCOVERY_KEY, this.port, _ => {
          log("drain: ..discovery unannounced");
          this.discovery.destroy(err => {
            if (err) {
              log("drain: ..discovery destroy failed:", err);
              return done(err);
            }
            log("drain: ..discovery destroyed");
            this.server.close(() => {
              log("drain: ..server closed -- all stopped");
              this.discovery = null;
              this.setState(UpgradeState.Server.Idle, null);
              done();
            });
          });
        });
      }
    });
  }

  // HttpRequest, HttpResponse -> Bool
  handleHttpRequest(req, res) {
    if (!this.handleListRequest(req, res)) {
      if (!this.handleGetContentRequest(req, res)) {
        return false;
      }
    }
    return true;
  }

  // HttpRequest, HttpResponse -> Void
  handleListRequest(req, res) {
    if (req.method !== "GET" || req.url !== "/list") return false;
    const reqId = Math.floor(Math.random() * 1000000).toString(16);
    log(reqId, "received /list request");

    this.stateLock.readLock(release => {
      if (this.state !== UpgradeState.Server.Sharing) {
        log(reqId, "unable to service request");
        res.statusCode = 503;
        res.end('"service unavailable"');
        return release();
      }

      getAvailableUpgrades(this.storage, (err, options) => {
        if (err) {
          log(reqId, "failed to get available upgrades from storage");
          res.statusCode = 500;
          res.end(err.toString());
        } else {
          log(reqId, "served request ok");
          res.statusCode = 200;
          res.end(JSON.stringify(options));
        }
        return release();
      });
    });

    return true;
  }

  // HttpRequest, HttpResponse -> Void
  handleGetContentRequest(req, res) {
    const m = req.url.match(/\/content\/(.*)$/);
    if (req.method !== "GET" || !m) return false;

    const reqId = Math.floor(Math.random() * 1000000).toString(16);
    log(reqId, "received /content request");

    this.stateLock.readLock(release => {
      if (this.state !== UpgradeState.Server.Sharing) {
        log(reqId, "unable to service request");
        res.statusCode = 503;
        res.end('"service unavailable"');
        return release();
      }

      getAvailableUpgrades(this.storage, (err, options) => {
        if (err) {
          log(reqId, "failed to get available upgrades from storage");
          res.statusCode = 500;
          res.end(err.toString());
          return release();
        }

        const hash = m[1];
        const option = options.filter(o => o.hash === hash)[0];
        if (!option) {
          log(reqId, "request for non-existant upgrade:", hash);
          res.statusCode = 404;
          res.end('"no such upgrade"');
          return release();
        }

        const rs = this.storage.createReadStream(hash);
        if (!rs) {
          log(reqId, "internal failure to read upgrade data:", hash);
          res.statusCode = 500;
          res.end('"could not read upgrade data"');
          return release();
        }

        const upload = {
          sofar: 0,
          total: option.size,
        };
        this.uploads.push(upload);
        this.setState(this.state, this.uploads);

        const tracker = through((chunk, enc, next) => {
          if (chunk) upload.sofar += chunk.length;
          this.setState(this.state, this.uploads);
          next(null, chunk);
        });

        log(reqId, "piping file data to client for hash:", hash);
        res.statusCode = 200;
        pump(rs, tracker, res, err => {
          this.uploads = this.uploads.filter(u => u !== upload);
          this.setState(this.state, this.uploads);
          if (err) {
            log(reqId, "upload for", hash, "failed:", err);
          } else {
            log(reqId, "upload for", hash, "complete");
          }
          this.emit("upload-complete", upload);
        });

        return release();
      });
    });

    return true;
  }
}

function getAvailableUpgrades(storage, cb) {
  storage.getAvailableUpgrades((err, options) => {
    if (err) return cb(err);
    options.forEach(o => {
      delete o.filename;
      return o;
    });
    cb(null, options);
  });
}

module.exports = UpgradeServer;
