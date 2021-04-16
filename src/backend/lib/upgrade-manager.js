const UpgradeStorage = require("./upgrade-storage");
const UpgradeServer = require("./upgrade-server");
const UpgradeDownload = require("./upgrade-download");
const semver = require("semver");
const log = require("debug")("p2p-upgrades:manager");
const validate = require("./validate-upgrade-state");
const { EventEmitter } = require("events");

class UpgradeManager extends EventEmitter {
  constructor({ dir, port, currentVersion }) {
    super();
    this.storage = new UpgradeStorage(dir, { version: currentVersion });
    this.server = new UpgradeServer(this.storage, port);
    this.downloader = new UpgradeDownload(this.storage, {
      version: currentVersion,
    });

    this.upgradeSearchTimeout = null;
    this.upgradeOptions = [];

    // State aggregation
    this.state = {
      server: { state: this.server.state, context: this.server.context },
      downloader: {
        search: {
          state: this.downloader._search.state,
          context: this.downloader._search.context,
        },
        download: {
          state: this.downloader._download.state,
          context: this.downloader._download.context,
        },
        check: {
          state: this.downloader._check.state,
          context: this.downloader._check.context,
        },
      },
    };
    this.server.on("state", (state, context) => {
      this.state.server = { state, context };
      this.emitState();
    });
    this.downloader.on("state", state => {
      this.state.downloader = state;
      this.emitState();
    });
  }

  // Ensures that any Error instances are converted into objects that serialize
  // properly over the RN Bridge. Mutates state.
  sanitizeState() {
    if (this.state.server.context instanceof Error) {
      this.state.server.context = {
        message: this.state.server.context.message,
      };
    }
    if (this.state.downloader.search.context instanceof Error) {
      this.state.downloader.search.context = {
        message: this.state.downloader.search.context.message,
      };
    }
    if (this.state.downloader.download.context instanceof Error) {
      this.state.downloader.download.context = {
        message: this.state.downloader.download.context.message,
      };
    }
    if (this.state.downloader.check.context instanceof Error) {
      this.state.downloader.check.context = {
        message: this.state.downloader.check.context.message,
      };
    }
  }

  startServices() {
    log("got request to start services");
    this.server.share();
    this.downloader.start();

    this.upgradeSearchTimeout = setTimeout(
      this.onCheckForUpgrades.bind(this),
      7000
    );
    this.downloader.on("state", state => {
      if (state.search.context && state.search.context.upgrades) {
        this.upgradeOptions = state.search.context.upgrades;
      }
    });
  }

  stopServices() {
    log("got request to stop services");
    this.server.drain();
    this.downloader.stop();

    if (this.upgradeSearchTimeout) {
      clearTimeout(this.upgradeSearchTimeout);
    }
  }

  getState() {
    log("got request for state");
    this.emitState();
  }

  emitState() {
    const result = validate(this.state);
    if (result) {
      const msg = result.join(",");
      this.emit("error", { message: msg });
    } else {
      this.sanitizeState();
      this.emit("state", this.state);
    }
  }

  setApkInfo(apkPath, version, cb) {
    log("setApkInfo", apkPath, version);
    this.storage.setApkInfo(apkPath, version, cb);
  }

  onCheckForUpgrades() {
    log("checking for upgrade options..");
    if (this.upgradeSearchTimeout) {
      // Pick the newest upgrade, if available
      this.upgradeOptions.sort(semver.compare);

      if (!this.upgradeOptions.length) {
        log("..none found");
        this.upgradeSearchTimeout = setTimeout(
          this.onCheckForUpgrades.bind(this),
          7000
        );
        return;
      }

      // Download
      const target = this.upgradeOptions[this.upgradeOptions.length - 1];
      log("..found an upgrade & starting download:", target);
      this.downloader.download(target);
      this.upgradeSearchTimeout = null;
    }
  }
}

module.exports = UpgradeManager;
