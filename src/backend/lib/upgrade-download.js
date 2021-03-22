const semver = require("semver");
const http = require("http");
const collect = require("collect-stream");
const EventEmitter = require("events").EventEmitter;
const dns = require("dns-discovery");
const RWLock = require("rwlock");
const pump = require("pump");
const through = require("through2");
const debug = require("debug");
const log = debug("upgrade-download");
const clone = require("clone");

const { DISCOVERY_KEY, UpgradeState } = require("./constants");

// Manager object responsible for coordinating the Search, Download, and Check
// subcomponents.
class UpgradeDownloader extends EventEmitter {
  // UpgradeStorage -> Void
  constructor(storage) {
    super();

    this._search = new Search(storage);
    this._check = new Check(storage);
    this._download = new Download(storage);
    this._storage = storage;

    this.state = {
      search: { state: this._search.state, context: this._search.context },
      download: {
        state: this._download.state,
        context: this._download.context,
      },
      check: { state: this._check.state, context: this._check.context },
    };

    // Track the state of subcomponents (search, download, check)
    this._search.on("state", (state, context) => {
      // XXX: no need to make a deep copy, since it's going to be cloned in the
      // upgrade manager
      this.state.search = { state, context };
      this.emit("state", this.state);
    });
    this._download.on("state", (state, context) => {
      this.state.download = { state, context };
      this.emit("state", this.state);

      // Check for a new version once the download has finished
      if (state === UpgradeState.Download.Downloaded) {
        this._check.check();
      }
    });
    this._check.on("state", (state, context) => {
      this.state.check = { state, context };
      this.emit("state", this.state);
    });

    // Check for a new version on init
    this._check.check();
  }

  start() {
    this._search.start();
  }

  stop() {
    this._search.stop();
  }

  download(option) {
    this._download.download(option);
  }
}

// Responsible for searching for other Mapeo peers on the local network,
// querying them for available upgrades, and recording the ones that are newer
// than the current APK version.
class Search extends EventEmitter {
  constructor(storage) {
    super();

    this.storage = storage;
    this.state = null;
    this.context = null;
    this.setState(UpgradeState.Search.Idle, null);
    this.discovery = null;
    this.stateLock = new RWLock();
  }

  start() {
    this.stateLock.writeLock(release => {
      if (this.state !== UpgradeState.Search.Idle) return release();

      this.discovery = dns({
        server: [],
        ttl: 60, // seconds
        loopback: false,
      });
      this.discovery.lookup(DISCOVERY_KEY);
      this.discovery.on("peer", this.onPeer.bind(this));

      this.setState(UpgradeState.Search.Searching, {
        startTime: Date.now(),
        upgrades: [],
      });

      release();
    });
  }

  onPeer(app, { host, port }) {
    if (this.state !== UpgradeState.Search.Searching) return; // shouldn't happen
    if (app !== DISCOVERY_KEY) return;
    log("found upgrade peer", app, host, port);

    this.stateLock.readLock(release => {
      if (this.state !== UpgradeState.Search.Searching) return release();

      http
        .get({ hostname: host, port, path: "/list" }, res => {
          collect(res, (err, buf) => {
            if (err) return release();
            try {
              const data = JSON.parse(buf.toString());
              data.forEach(upgrade => {
                // See if this upgrade is compatible
                if (this.isUpgradeCandidate(upgrade)) {
                  const newContext = clone(this.context);
                  const newUpgrade = Object.assign(upgrade, { host, port });
                  newContext.upgrades.push(newUpgrade);
                  log("upgrade added", newUpgrade);
                  this.setState(UpgradeState.Search.Searching, newContext);
                } else {
                  log("dismissed candidate", upgrade);
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
      if (this.state !== UpgradeState.Search.Searching) return release();

      this.discovery.destroy(err => {
        if (err) this.setState(UpgradeState.Search.Error, err);
        else this.setState(UpgradeState.Search.Idle, null);
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
    if (upgrade.arch.indexOf(this.storage.getLocalArch()) === -1) return false;
    if (upgrade.platform !== this.storage.getLocalPlatform()) return false;
    if (!semver.valid(upgrade.version)) return false;
    if (!semver.gt(upgrade.version, this.storage.getLocalVersion()))
      return false;
    if (this.context.upgrades.some(u => u.hash === upgrade.hash)) return false;
    return true;
  }
}

// Responsible for downloading a given UpgradeOption and tracking its download
// progress.
class Download extends EventEmitter {
  constructor(storage) {
    super();
    this.state = null;
    this.context = null;
    this.setState(UpgradeState.Download.Idle, null);
    this.storage = storage;
  }

  setState(state, context) {
    this.state = state;
    this.context = context;
    this.emit("state", state, context);
  }

  download(option) {
    if (this.state !== UpgradeState.Download.Idle) return;
    this.setState(UpgradeState.Download.Downloading, {
      sofar: 0,
      total: option.size,
    });

    const url = `/content/${option.id}`;
    http
      .get({ hostname: option.host, port: option.port, path: url }, res => {
        const filename = option.hash;
        let sofar = 0;
        const progress = through((chunk, enc, next) => {
          sofar += chunk.length;
          this.setState(UpgradeState.Download.Downloading, {
            sofar,
            total: option.size,
          });
          next(null, chunk);
        });
        const ws = this.storage.createApkWriteStream(
          filename,
          option.version,
          option.hash,
          err => {
            if (err) this.setState(UpgradeState.Download.Error, err);
            else this.setState(UpgradeState.Download.Downloaded, null);
          }
        );
        pump(res, progress, ws, err => {
          this.setState(UpgradeState.Download.Idle, null);
        });
      })
      .once("error", err => {
        this.setState(UpgradeState.Download.Idle, null);
      });
  }
}

// Responsible for checking local storage to see if a newer compatible upgrade
// is available on disk.
class Check extends EventEmitter {
  constructor(storage) {
    super();
    this.state = null;
    this.context = null;
    this.setState(UpgradeState.Check.NotAvailable, null);
    this.storage = storage;
  }

  setState(state, context) {
    this.state = state;
    this.context = context;
    this.emit("state", state, context);
  }

  check() {
    if (this.state !== UpgradeState.Check.NotAvailable) return;

    this.storage.getAvailableUpgrades((err, options) => {
      if (err) return this.setState(UpgradeState.Check.Error, err);
      options = options.filter(o => this.isUpgradeCandidate(o));
      if (options.length > 0) {
        this.setState(UpgradeState.Check.Available, {
          filename: options[0].filename,
        });
      }
    });
  }

  // UpgradeOption -> Bool
  isUpgradeCandidate(upgrade) {
    if (upgrade.arch.indexOf(this.storage.getLocalArch()) === -1) return false;
    if (upgrade.platform !== this.storage.getLocalPlatform()) return false;
    if (!semver.valid(upgrade.version)) return false;
    if (!semver.gt(upgrade.version, this.storage.getLocalVersion()))
      return false;
    return true;
  }
}

module.exports = UpgradeDownloader;
