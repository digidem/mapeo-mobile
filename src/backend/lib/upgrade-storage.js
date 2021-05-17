// @ts-check

const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const util = require("util");
const crypto = require("crypto");
const duplexify = require("duplexify");
const rimraf = util.promisify(require("rimraf"));
const AsyncService = require("./async-service");
const {
  installerCompare,
  getInstallerInfo,
  beforeAfterStream,
} = require("./utils");

/** @typedef {import('./types').InstallerInt} InstallerInt */

/**
 * @typedef {Object} Events
 * @property {(installers: InstallerInt[]) => void} installers
 * @property {(error: Error) => void} error
 */

/**
 * Manage storage of available installers including the currently running APK
 * Emits an "installers" event whenever the available list of installers changes
 *
 * @extends {AsyncService<Events>}
 */
class Storage extends AsyncService {
  /**
   * @param {object} options
   * @param {string} options.storageDir Path to storage folder for upgrade APKs
   * @param {InstallerInt} options.currentApkInfo Path to currently running APK
   */
  constructor({ storageDir, currentApkInfo }) {
    super();

    /**
     * @private
     * @type {Map<string, InstallerInt>}
     */
    this._installers = new Map();
    /** @private */
    this._storageDir = storageDir;
    /** @private */
    this._tmpdir = path.join(storageDir, "tmp");
    /** @private */
    this._currentApkInfo = currentApkInfo;

    // Start on initialization, emit an error if initialization fails
    this.start().catch(e => {
      this.emit("error", e);
    });
  }

  /**
   * Initialize storage, runs on initialization of class, other methods can
   * await this.read() and will always run after this init
   */
  async _start() {
    await rimraf(this._tmpdir);
    await mkdirp(this._tmpdir);
    await mkdirp(this._storageDir);
    const apkFiles = (await fs.promises.readdir(this._storageDir))
      .filter(file => path.extname(file) === ".apk")
      .map(file => path.join(this._storageDir, file));
    const storedInstallerInts = await Promise.all(
      apkFiles.map(file => getInstallerInfo(file))
    );
    /** @type {string[]} */
    const forDeletion = [];

    for (const installer of storedInstallerInts) {
      if (!installer) continue;
      // Mark any upgrade < current installed APK for deletion
      if (installerCompare(installer, this._currentApkInfo) === -1) {
        forDeletion.push(installer.filepath);
      } else {
        this._installers.set(installer.hash, installer);
      }
    }

    this._installers.set(this._currentApkInfo.hash, this._currentApkInfo);

    await Promise.all(forDeletion.map(file => fs.promises.unlink(file)));
    this.emit("installers", Array.from(this._installers.values()));
  }

  async _stop() {
    // Nothing to stop
  }

  /**
   * Get a list of available installers
   *
   * @returns {Promise<InstallerInt[]>}
   */
  async list() {
    await this.started();
    return Array.from(this._installers.values());
  }

  /**
   * Get metadata about an installer in the store, identified by `hash`
   *
   * @param {string} hash
   * @returns {Promise<InstallerInt | void>}
   */
  async get(hash) {
    await this.started();
    return this._installers.get(hash);
  }

  /**
   * Create a readstream for an APK in storage, lookup by hash
   *
   * @param {string} hash
   * @returns {import('stream').Readable}
   */
  createReadStream(hash) {
    const str = duplexify();
    // @ts-ignore This is allowed, typing is incorrect
    str.setWritable(null);

    this.started()
      .then(() => {
        const upgrade = this._installers.get(hash);
        if (!upgrade) return str.destroy(new Error("NotFound"));
        str.setReadable(fs.createReadStream(upgrade.filepath));
      })
      .catch(e => {
        str.destroy(e);
      });

    return str;
  }

  /**
   * Create a writable stream for adding an installer to storage.
   *
   * @param {object} options
   * @param {string} options.hash Expected sha256 hash of the incoming file
   */
  createWriteStream({ hash: expectedHash }) {
    const tmpFilepath = path.join(
      this._tmpdir,
      crypto.randomBytes(8).toString("hex") + ".apk"
    );
    return beforeAfterStream({
      createStream: async () => {
        await this.started();
        return fs.createWriteStream(tmpFilepath);
      },
      finalize: async fsStream => {
        try {
          // Everything after here happens after createWriteStream has finished, but
          // that's ok because this is UpgradeStorage updating its state
          const installer = await getInstallerInfo(tmpFilepath);
          if (!installer) {
            // We couldn't read the info about this installer
            throw new Error("Could not parse APK");
          }
          if (installer.hash !== expectedHash) {
            // Hashes did not match, download was broken or incorrectly advertised
            throw new Error("Invalid hash");
          }
          installer.filepath = path.join(
            this._storageDir,
            installer.hash + ".apk"
          );
          await fs.promises.rename(tmpFilepath, installer.filepath);
          this._installers.set(installer.hash, installer);
          this.emit("installers", Array.from(this._installers.values()));
        } catch (e) {
          // Cleanup if necessary
          try {
            fsStream.destroy(e);
            await fs.promises.unlink(tmpFilepath);
          } catch (e) {}
        }
      },
    });
  }
}

module.exports = Storage;
