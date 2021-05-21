// @ts-check

const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const util = require("util");
const crypto = require("crypto");
const duplexify = require("duplexify");
const rimraf = util.promisify(require("rimraf"));
const AsyncService = require("./async-service");
const stream = require("stream");
const {
  installerCompare,
  getInstallerInfo,
  beforeAfterStream,
  stringifyInstaller,
} = require("./utils");
const log = require("debug")("p2p-upgrades:storage");

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
  /** @type {Map<string, InstallerInt>} */
  #installers;
  #storageDir;
  #tmpdir;
  #currentApkInfo;
  /**
   * @param {object} options
   * @param {string} options.storageDir Path to storage folder for upgrade APKs
   * @param {InstallerInt} options.currentApkInfo Path to currently running APK
   */
  constructor({ storageDir, currentApkInfo }) {
    super();
    this.#installers = new Map();
    this.#storageDir = storageDir;
    this.#tmpdir = path.join(storageDir, "tmp");
    this.#currentApkInfo = currentApkInfo;

    // Start on initialization, emit an error if initialization fails
    this.start().catch(e => {
      this.emit("error", e);
    });
  }

  /**
   * Initialize storage, runs on initialization of class, other methods can
   * await this.started() and will only run after this initialization
   */
  async _start() {
    await rimraf(this.#tmpdir);
    await mkdirp(this.#tmpdir);
    await mkdirp(this.#storageDir);
    const apkFiles = (await fs.promises.readdir(this.#storageDir))
      .filter(file => path.extname(file) === ".apk")
      .map(file => path.join(this.#storageDir, file));
    const storedInstallerInts = await Promise.all(
      // Catch errors trying to read the apk file and ignore it
      apkFiles.map(file => getInstallerInfo(file).catch(() => {}))
    );
    /** @type {Set<InstallerInt>} */
    const forDeletion = new Set();

    for (const installer of storedInstallerInts) {
      if (!installer) continue;
      // Mark any upgrade < current installed APK for deletion
      if (installerCompare(installer, this.#currentApkInfo) === -1) {
        forDeletion.add(installer);
      } else {
        this.#installers.set(installer.hash, installer);
      }
    }

    this.#installers.set(this.#currentApkInfo.hash, this.#currentApkInfo);

    if (forDeletion.size) {
      log(
        "Deleting old installers:",
        [...forDeletion].map(i => stringifyInstaller(i))
      );
    }

    await Promise.all(
      [...forDeletion].map(installer => fs.promises.unlink(installer.filepath))
    );
    const installerArray = Array.from(this.#installers.values());
    this.emit("installers", installerArray);
    log(
      "Initialized storage with installers:",
      installerArray.map(i => stringifyInstaller(i))
    );
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
    return Array.from(this.#installers.values());
  }

  /**
   * Get metadata about an installer in the store, identified by `hash`
   *
   * @param {string} hash
   * @returns {Promise<InstallerInt | void>}
   */
  async get(hash) {
    await this.started();
    return this.#installers.get(hash);
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
        const upgrade = this.#installers.get(hash);
        if (!upgrade) return str.destroy(new Error("NotFound"));
        log(`Read started: ${hash.slice(0, 7)}`);
        str.setReadable(fs.createReadStream(upgrade.filepath));
      })
      .catch(e => {
        str.destroy(e);
      });

    stream.finished(str, e => {
      if (e) {
        log(`Read error for ${hash.slice(0, 7)}: `, e);
      } else {
        log(`Read finished: ${hash.slice(0, 7)}`);
      }
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
      this.#tmpdir,
      crypto.randomBytes(8).toString("hex") + ".apk"
    );
    return beforeAfterStream({
      createStream: async () => {
        log(`Write started: ${expectedHash.slice(0, 7)}`);
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
            this.#storageDir,
            installer.hash + ".apk"
          );
          await fs.promises.rename(tmpFilepath, installer.filepath);
          this.#installers.set(installer.hash, installer);
          log(`Write complete: ${stringifyInstaller(installer)}`);
          this.emit("installers", Array.from(this.#installers.values()));
        } catch (e) {
          log("WriteStream Error:", e);
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
