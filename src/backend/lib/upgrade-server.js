// @ts-check
const pump = require("pump");
const discovery = require("dns-discovery");
const EventEmitter = require("events").EventEmitter;
const RWLock = require("rwlock");
const http = require("http");
const { UpgradeState } = require("./constants");
const { getDiscoveryKey } = require("./util");
const log = require("debug")("p2p-upgrades:server");
const progressStream = require("progress-stream");
const UpgradeStorage = require("./upgrade-storage");

/*
type Uploads = [UploadInfo]

type UploadInfo = {
  sofar: Number,
  total: Number
}
*/

// How frequently to emit progress events (in ms)
const PROGRESS_THROTTLE_MS = 400; // milliseconds

class UpgradeServer extends EventEmitter {
  /**
   * @constructor
   * @param {UpgradeStorage} storage
   * @param {number} port
   */
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
      function done() {
        release();
        if (cb) cb();
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
        const discoveryKey = getDiscoveryKey(this.storage.getLocalBundleId());
        log("announcing on", discoveryKey);
        this.announceInterval = setInterval(() => {
          this.discovery.announce(discoveryKey, this.port);
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
        return stop();
      }

      // wait for all uploads to finish
      log(`drain: waiting for ${this.uploads.length} uploads to finish`);
      release();
      this.on("upload-complete", oncomplete.bind(this));
      function oncomplete() {
        if (this.uploads.length === 0) {
          log("drain: no uploads left; stopping now");
          this.removeListener("upload", oncomplete);
          stop();
        } else {
          log(
            `drain: still waiting for ${this.uploads.length} uploads to finish`
          );
        }
      }

      function stop() {
        log("drain: stopping..");

        if (self.announceInterval) {
          clearInterval(self.announceInterval);
          self.announceInterval = null;
        }

        // XXX: 'unannounce' seems to always return an error here; ignoring.
        self.discovery.unannounce(
          getDiscoveryKey(self.storage.getLocalBundleId()),
          self.port,
          _ => {
            log("drain: ..discovery unannounced");
            self.discovery.destroy(err => {
              if (err) {
                log("drain: ..discovery destroy failed:", err);
                return done(err);
              }
              log("drain: ..discovery destroyed");
              self.server.close(() => {
                log("drain: ..server closed -- all stopped");
                self.discovery = null;
                self.setState(UpgradeState.Server.Idle, null);
                done();
              });
            });
          }
        );
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

        const tracker = progressStream({
          length: option.size,
          time: PROGRESS_THROTTLE_MS, // ms between each progress event
        });
        tracker.on("progress", ({ transferred }) => {
          upload.sofar = transferred;
          this.setState(this.state, this.uploads);
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
