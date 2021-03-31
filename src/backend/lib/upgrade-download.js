const semver = require("semver");
const http = require("http");
const collect = require("collect-stream");
const EventEmitter = require("events").EventEmitter;
const dns = require("dns-discovery");
const RWLock = require("rwlock");
const pump = require("pump");
const through = require("through2");
const searchLog = require("debug")("p2p-upgrades:search");
const downloadLog = require("debug")("p2p-upgrades:download");
const checkLog = require("debug")("p2p-upgrades:check");
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
        loopback: false,
      });
      this.discovery.lookup(DISCOVERY_KEY);
      this.discovery.on("peer", this.onPeer.bind(this));

      searchLog("beginning search");
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
    searchLog("found potential upgrade peer", host, port);

    this.stateLock.readLock(release => {
      if (this.state !== UpgradeState.Search.Searching) return release();

      searchLog("querying peer", host, port);
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
                  searchLog("new upgrade candidate found", newUpgrade);
                  this.setState(UpgradeState.Search.Searching, newContext);
                } else {
                  searchLog("skipped upgrade candidate", upgrade);
                }
              });
            } catch (err) {
              searchLog("JSON parse error:", err);
            } finally {
              release();
            }
          });
        })
        .once("error", err => {
          searchLog("HTTP error:", err);
          release();
        });
    });
  }

  stop() {
    searchLog("stopping..");
    this.stateLock.writeLock(release => {
      if (this.state !== UpgradeState.Search.Searching) return release();

      this.discovery.destroy(err => {
        if (err) {
          this.setState(UpgradeState.Search.Error, err);
          searchLog("..stopped, with error:", err);
        } else {
          this.setState(UpgradeState.Search.Idle, null);
          searchLog("..stopped");
        }
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
    downloadLog("starting download of upgrade", option);

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
        downloadLog("starting download of upgrade", option);
        pump(res, progress, ws, err => {
          if (err) downloadLog("download pipeline error", err);
          else downloadLog("download pipeline ended ok");
          this.setState(UpgradeState.Download.Idle, null);
        });
      })
      .once("error", err => {
        downloadLog("http error", err);
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

    checkLog("checking for an upgrade..");
    this.storage.getAvailableUpgrades((err, options) => {
      if (err) return this.setState(UpgradeState.Check.Error, err);
      options = options.filter(o => this.isUpgradeCandidate(o));
      if (options.length > 0) {
        checkLog("..found a viable upgrade", options[0]);
        this.setState(UpgradeState.Check.Available, {
          filename: options[0].filename,
        });
      } else {
        checkLog("..didn't find a viable upgrade");
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
