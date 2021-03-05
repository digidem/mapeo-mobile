const pump = require("pump");
const discovery = require("dns-discovery");
const EventEmitter = require("events").EventEmitter;
const RWLock = require("rwlock");
const through = require("through2");
const http = require("http");
const { DISCOVERY_KEY, UpgradeState } = require("./constants");

class UpgradeServer extends EventEmitter {
  constructor(storage, port) {
    super();
    this.storage = storage;
    this.stateLock = new RWLock();
    this.setState(UpgradeState.Server.Idle);
    this.context = null;
    this.port = port;
    this.server = http.createServer((req, res) => {
      if (!this.handleHttpRequest(req, res)) {
        res.statusCode = 404;
        res.end();
      }
    });

    // In-progress uploads
    this.uploads = [];
  }

  // XXX: public; also no concurrency guards!
  setState(to, context) {
    this.state = to;
    this.context = context;
    this.emit("state", to, this.context);
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

      if (this.state !== UpgradeState.Server.Idle) return done();

      const opts = {
        server: [],
        ttl: 60, // seconds
        loopback: false,
      };
      this.discovery = discovery(opts);
      this.server.listen(this.port, "0.0.0.0", () => {
        this.discovery.announce(DISCOVERY_KEY, this.port, err => {
          if (err) return done(err);
          this.setState(UpgradeState.Server.Sharing, this.uploads);
          done();
        });
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

      if (this.state !== UpgradeState.Server.Sharing) return done();

      this.setState(UpgradeState.Server.Draining, this.uploads);
      if (this.uploads.length === 0) return stop.bind(this)();

      // wait for all uploads to finish
      release();
      this.on("upload-complete", oncomplete.bind(this));
      function oncomplete() {
        if (this.uploads.length === 0) {
          this.removeListener("upload", oncomplete);
          stop.call(this);
        }
      }

      function stop() {
        // XXX: 'unannounce' seems to always return an error here; ignoring.
        this.discovery.unannounce(DISCOVERY_KEY, this.port, _ => {
          this.discovery.destroy(err => {
            if (err) return done(err);
            this.server.close(() => {
              this.discovery = null;
              this.setState(UpgradeState.Server.Idle);
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

    this.stateLock.readLock(release => {
      if (this.state !== UpgradeState.Server.Sharing) {
        res.statusCode = 503;
        res.end('"service unavailable"');
        return release();
      }

      this.storage.getAvailableUpgrades((err, options) => {
        if (err) {
          res.statusCode = 500;
          res.end(err.toString());
        } else {
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

    this.stateLock.readLock(release => {
      if (this.state !== UpgradeState.Server.Sharing) {
        res.statusCode = 503;
        res.end('"service unavailable"');
        return release();
      }

      this.storage.getAvailableUpgrades((err, options) => {
        if (err) {
          res.statusCode = 500;
          res.end(err.toString());
          return release();
        }

        const hash = m[1];
        const option = options.filter(o => o.hash === hash)[0];
        if (!option) {
          res.statusCode = 404;
          res.end('"no such upgrade"');
          return release();
        }

        const rs = this.storage.createReadStream(hash);
        if (!rs) {
          res.statusCode = 500;
          res.end('"could not read upgrade data"');
          return release();
        }

        const upload = {
          sofar: 0,
          total: option.size,
        };
        this.uploads.push(upload);

        const tracker = through((chunk, enc, next) => {
          if (chunk) upload.sofar += chunk.length;
          this.setState(this.state, this.uploads);
          next(null, chunk);
        });

        res.statusCode = 200;
        pump(rs, tracker, res, () => {
          this.uploads = this.uploads.filter(u => u !== upload);
          this.setState(this.state, this.uploads);
          this.emit("upload-complete", upload);
        });

        return release();
      });
    });

    return true;
  }
}

module.exports = UpgradeServer;
