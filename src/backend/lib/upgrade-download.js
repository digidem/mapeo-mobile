const semver = require("semver");
const http = require("http");
const collect = require("collect-stream");
const EventEmitter = require("events").EventEmitter;
const dns = require("dns-discovery");
const RWLock = require("rwlock");
const pump = require("pump");
const through = require("through2");

const DISCOVERY_KEY = require("./constants").DISCOVERY_KEY;

// Enum
const SearchState = {
  Idle: 1,
  Searching: 2,
  Error: 3,
};

// Enum
const DownloadState = {
  Idle: 1,
  Downloading: 2,
  Downloaded: 3,
  Error: 4,
};

// Enum
const CheckState = {
  NotAvailable: 1,
  Available: 2,
  Error: 3,
};

// Manager object responsible for coordinating the Search, Download, and Check
// subcomponents.
class UpgradeDownloader extends EventEmitter {
  // UpgradeStorage -> Void
  constructor(storage, opts) {
    super();
    opts = opts || {};

    this.search = new Search(opts);
    this.check = new Check(storage);
    this.download = new Download(storage);
    this.storage = storage;

    this.state = {
      search: { state: this.search.state, context: this.search.context },
      download: { state: this.download.state, context: this.download.context },
      // TODO: check
    };

    this.search.on("state", (state, context) => {
      this.state.search = { state, context };
      // XXX: no need to make a deep copy, since it's going to be serialized
      // over the RN bridge anyways
      this.emit("state", this.state);
    });
    this.download.on("state", (state, context) => {
      this.state.download = { state, context };
      // XXX: no need to make a deep copy, since it's going to be serialized
      // over the RN bridge anyways
      this.emit("state", this.state);

      // Check for a new version once the download has finished
      if (state === DownloadState.Downloaded) {
        this.check.check();
      }
    });
    this.check.on("state", (state, context) => {
      this.state.check = { state, context };
      // XXX: no need to make a deep copy, since it's going to be serialized
      // over the RN bridge anyways
      this.emit("state", this.state);
    });

    // Check for a new version on init
    this.check.check();
  }

  start() {
    this.search.start();
  }

  stop() {
    this.search.stop();
  }
}

// Responsible for searching for other Mapeo peers on the local network,
// querying them for available upgrades, and recording the ones that are newer
// than the current APK version.
class Search extends EventEmitter {
  constructor({ version, platform, arch }) {
    super();

    this.state = SearchState.Idle;
    this.context = null;
    this.discovery = null;
    this.stateLock = new RWLock();
    this.targetPlatform = platform || "android";
    this.targetArch = arch || "arm64-v8a";
    this.version = version || "0.0.0";
  }

  start() {
    this.stateLock.writeLock(release => {
      if (this.state !== SearchState.Idle) return release();

      this.discovery = dns({
        server: [],
        ttl: 60, // seconds
        loopback: false,
      });
      this.discovery.lookup(DISCOVERY_KEY);
      this.discovery.on("peer", this.onPeer.bind(this));

      this.setState(SearchState.Searching, {
        upgrades: [],
      });

      release();
    });
  }

  onPeer(name, { host, port }) {
    this.stateLock.readLock(release => {
      if (this.state !== SearchState.Searching) return release();

      http
        .get({ hostname: host, port, path: "/list" }, res => {
          collect(res, (err, buf) => {
            if (err) return release();
            try {
              const data = JSON.parse(buf.toString());
              data.forEach(upgrade => {
                // See if this upgrade is compatible
                if (this.isUpgradeCandidate(upgrade)) {
                  this.context.upgrades.push(
                    Object.assign({}, upgrade, { host, port })
                  );
                  this.emit("state", this.state, this.context);
                }
              });
            } catch (err) {
              // XXX: ignore error + peer
            } finally {
              release();
            }
          });
        })
        .once("error", _ => {
          // XXX: ignore error + peer
          release();
        });
    });
  }

  stop() {
    this.stateLock.writeLock(release => {
      if (this.state !== SearchState.Searching) return release();

      this.discovery.destroy(err => {
        if (err) this.setState(SearchState.Error, err);
        else this.setState(SearchState.Idle, null);
        release();
      });
    });
  }

  setState(state, context) {
    this.state = state;
    this.context = context;
    this.emit("state", state, context);
  }

  // UpgradeOption -> Bool
  isUpgradeCandidate(upgrade) {
    if (upgrade.arch.indexOf(this.targetArch) === -1) return false;
    if (upgrade.platform !== this.targetPlatform) return false;
    if (!semver.valid(upgrade.version)) return false;
    if (!semver.gt(upgrade.version, this.version)) return false;
    if (this.context.upgrades.some(u => u.hash === upgrade.hash)) return false;
    return true;
  }
}

// Responsible for downloading a given UpgradeOption and tracking its download
// progress.
class Download extends EventEmitter {
  constructor(storage) {
    super();
    this.state = DownloadState.Idle;
    this.context = null;
    this.storage = storage;
  }

  setState(state, context) {
    this.state = state;
    this.context = context;
    this.emit("state", state, context);
  }

  download(option) {
    if (this.state !== DownloadState.Idle) return;
    this.setState(DownloadState.Downloading, { sofar: 0, total: option.size });

    const url = `/content/${option.id}`;
    http
      .get({ hostname: option.host, port: option.port, path: url }, res => {
        const filename = option.hash;
        let sofar = 0;
        const progress = through((chunk, enc, next) => {
          sofar += chunk.length;
          this.setState(DownloadState.Downloading, {
            sofar,
            total: option.size,
          });
          next(null, chunk);
        });
        const ws = this.storage.createApkWriteStream(
          filename,
          option.version,
          err => {
            if (err) this.setState(DownloadState.Error, err);
            else this.setState(DownloadState.Downloaded, null);
          }
        );
        pump(res, progress, ws);
      })
      .once("error", _ => {
        // TODO: handle err
      });
  }
}

// Responsible for checking local storage to see if a newer compatible upgrade
// is available on disk.
class Check extends EventEmitter {
  constructor(storage) {
    super();
    this.state = CheckState.NotAvailable;
    this.context = null;
    this.storage = storage;
  }

  setState(state, context) {
    this.state = state;
    this.context = context;
    this.emit("state", state, context);
  }

  check() {
    if (this.state !== CheckState.NotAvailable) return;

    this.storage.getAvailableUpgrades((err, options) => {
      if (err) return this.setState(CheckState.Error, err);
      if (options.length > 0) {
        this.setState(CheckState.Available, { filename: options[0].hash });
      }
    });
  }
}

module.exports = UpgradeDownloader;
