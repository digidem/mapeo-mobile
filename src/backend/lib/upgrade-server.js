const pump = require("pump");
const discovery = require("dns-discovery");
const EventEmitter = require("events").EventEmitter;
const RWLock = require("rwlock");
const through = require("through2");
const DISCOVERY_KEY = require("./constants").DISCOVERY_KEY;

// Enum
const State = {
  Idle: 1,
  Sharing: 2,
  Draining: 3,
  Error: 4
};

class UpgradeServer extends EventEmitter {
  constructor(storage, port) {
    super();
    this.storage = storage;
    this.stateLock = new RWLock();
    this.setState(State.Idle);
    this.error = null;
    this.port = port;

    // In-progress uploads
    this.uploads = [];
  }

  // XXX: public; also no concurrency guards!
  setState(to, err) {
    this.state = to;
    if (err) this.error = err;
    this.emit("state", to);
  }

  // Callback<Void> -> Void
  share(cb) {
    this.stateLock.writeLock(release => {
      const self = this;
      function done(err) {
        if (err) self.setState(State.Error, err);
        release();
        if (cb) cb(err);
      }

      if (this.state !== State.Idle) return done();

      const opts = {
        server: [],
        ttl: 60, // seconds
        loopback: false
      };
      this.discovery = discovery(opts);
      this.discovery.announce(DISCOVERY_KEY, this.port, err => {
        if (err) return done(err);
        this.setState(State.Sharing);
        done();
      });
    });
  }

  // Callback<Void> -> Void
  drain(cb) {
    this.stateLock.writeLock(release => {
      const self = this;
      function done(err) {
        if (err) self.setState(State.Error, err);
        release();
        if (cb) cb(err);
      }

      if (this.state !== State.Sharing) return done();

      this.setState(State.Draining);
      if (this.uploads.length === 0) return stop.bind(this)();

      // wait for all uploads to finish
      release();
      this.on("upload-complete", oncomplete);
      function oncomplete() {
        if (this.uploads.length === 0) {
          this.removeListener("upload", oncomplete);
          this.drain(cb);
        }
      }

      function stop() {
        // XXX: 'unannounce' seems to always return an error here; ignoring.
        this.discovery.unannounce(DISCOVERY_KEY, this.port, _ => {
          this.discovery.destroy(err => {
            if (err) return done(err);
            this.discovery = null;
            this.setState(State.Idle);
            done();
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
      if (this.state !== State.Sharing) {
        res.statusCode = 503;
        res.end('"service unavailable"');
        return release();
      }

      const options = this.storage.getAvailableUpgrades();
      res.statusCode = 200;
      res.end(JSON.stringify(options));
      return release();
    });

    return true;
  }

  // HttpRequest, HttpResponse -> Void
  handleGetContentRequest(req, res) {
    const m = req.url.match(/\/content\/(.*)$/);
    if (req.method !== "GET" || !m) return false;

    this.stateLock.readLock(release => {
      if (this.state !== State.Sharing) {
        res.statusCode = 503;
        res.end('"service unavailable"');
        return release();
      }

      const options = this.storage.getAvailableUpgrades();
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
        total: option.size
      };
      this.uploads.push(upload);

      const tracker = through((chunk, enc, next) => {
        if (chunk) upload.sofar += chunk.length;
        next(null, chunk);
      });

      res.statusCode = 200;
      pump(rs, tracker, res, () => {
        this.uploads = this.uploads.filter(u => u !== upload);
        this.emit("upload-complete", upload);
      });

      return release();
    });

    return true;
  }
}

module.exports = UpgradeServer;
