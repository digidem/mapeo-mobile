// @ts-check
const http = require("http");
const createOsmDb = require("kappa-osm");
const kappa = require("kappa-core");
const level = require("level");
const path = require("path");
const raf = require("random-access-file");
const createMediaStore = require("safe-fs-blob-store");
const createMapeoRouter = require("mapeo-server");
const { AbortController } = require("abort-controller");
const debug = require("debug");
const { promisify } = require("util");

const AsyncService = require("./async-service");

const log = debug("mapeo-core:mapeo");
const MINUTE = 60 * 1000;

/**
 * A wrapper around Mapeo Core and Mapeo Server. Sets up storage, creates
 * kappa-core, kappa-osm and mapeo instances, and starts the mapeo server.
 *
 * @extends {AsyncService<{ error: (err: Error) => void }, [number]>}
 */
class Mapeo extends AsyncService {
  /** @type {Array<any>} */
  #storages = [];
  #indexDb;
  #server;
  /** @type {AbortController | null} */
  #closeSyncAbortController = null;
  #destroyed = false;

  /**
   * @param {object} options
   * @param {string} [options.projectKey]
   * @param {string} options.dbStorageDir Folder for storing database and indexes
   * @param {string} options.staticRoot Root folder for serving static files
   * @param {string} options.fallbackPresetsDir Folder with default presets
   */
  constructor({ dbStorageDir, projectKey, staticRoot, fallbackPresetsDir }) {
    super();
    const indexDir = path.join(dbStorageDir, "index");

    this.#indexDb = level(indexDir);
    // @ts-ignore - missing type for 'error' event
    this.#indexDb.on("error", err => this.emit("error", err));

    // Storage for kappeo-osm
    const coreDb = kappa(path.join(dbStorageDir, "db"), {
      valueEncoding: "json",
      encryptionKey: projectKey,
    });

    // The main osm db for observations and map data
    const osm = createOsmDb({
      core: coreDb,
      index: this.#indexDb,
      // @ts-ignore TODO: Add types
      storage: (name, cb) => {
        process.nextTick(() => {
          const storage = raf(path.join(indexDir, "bkd", name));
          this.#storages.push(storage);
          cb(null, storage);
        });
      },
    });

    // The media store for photos, video etc.
    const media = createMediaStore(path.join(dbStorageDir, "media"));

    // Handles all other routes for Mapeo
    const mapeoRouter = createMapeoRouter(osm, media, {
      staticRoot,
      fallbackPresetsDir,
      writeFormat: "osm-p2p-syncfile",
      deviceType: "mobile",
    });

    this.core = mapeoRouter.api.core;
    this.#server = http.createServer(function requestListener(req, res) {
      log(req.method + ": " + req.url);
      // Check if the route is handled by Mapeo Server
      var match = mapeoRouter.handle(req, res);

      // If not and headers are not yet sent, send a 404 error
      if (!match && !res.headersSent) {
        res.statusCode = 404;
        const error = {
          code: 404,
          message: "NotFound",
        };
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(error));
      }
    });
  }

  /**
   * Start Mapeo Server and sync services
   * @param {number} port
   * @returns {Promise<void>}
   */
  async _start(port) {
    if (this.#destroyed) throw new Error("Already destroyed");
    if (this.#closeSyncAbortController) {
      this.#closeSyncAbortController.abort();
    }
    return new Promise((resolve, reject) => {
      this.#server.once("error", reject);
      // Start the sync swarm (but do not adverstise yet)
      this.core.sync.listen(() => {
        // Start the Mapeo Server listening on port
        this.#server.listen(port, () => {
          this.#server.removeListener("error", reject);
          log("Mapeo Core listening on port " + port);
          resolve();
        });
      });
    });
  }

  /**
   * Close the server and set a timer to destroy any active syncs after 9
   * minutes (on Android if the task is left running in the background for too
   * long (10 minutes?), then Android might terminate this process, which will
   * require the app to be restarted).
   */
  async _stop() {
    if (this.#destroyed) throw new Error("Already destroyed");
    this.#closeSyncAbortController = new AbortController();
    const signal = this.#closeSyncAbortController.signal;

    // Wait up to 9 minutes to see if active syncs complete, then force-stop
    // the sync, but don't await it - we will cancel the destroy if we restart
    this._closeSyncWithTimeout({ timeout: 9 * MINUTE, signal }).catch(e =>
      // TODO: Report this to bugsnag
      log(e)
    );
    // Stop server from listening
    await new Promise(resolve => this.#server.close(resolve));
    this.#closeSyncAbortController = null;
  }

  /**
   * Close all resources (level databases, storages, etc.)
   */
  async destroy() {
    // We need to stop syncing to close Mapeo Core, arbitrarily waiting 1 second
    // for sync to complete before forcing a stop. We do not allow destroy() to
    // be aborted (unlike stop(), which can be aborted by calling start() before
    // it completes).
    await this._closeSyncWithTimeout({ timeout: 1000 });
    await promisify(this.core.close).call(this.core);
    const pending = [];

    // TODO: this.core.close() does not close the underlying hyperlogs or
    // stop indexing in @mapeo/core v8.1.3. This was added in v9 which we
    // are not yet using. When we switch to v9 we can remove the extra
    // cleanup of hypercores and the sync pause here.

    pending.push(
      /** @type {Promise<void>} */
      (new Promise(resolve => {
        // Pause any in-progress indexing
        this.core.osm.core.pause(() => {
          // This calls multifeed.close() which closes the hypercore feeds
          this.core.osm.core._logs.close(() => resolve());
        });
      }))
    );

    // Close all the random-access-file storages
    for (const storage of this.#storages) {
      pending.push(promisify(storage.close).call(storage));
    }

    // Close the indexDb database used for indexes
    pending.push(this.#indexDb.close());

    await Promise.all(pending);
    log("Closed all storage for kappa-osm");
  }

  /**
   * Wait for active syncs to complete, then force-stop the sync by closing
   * all TCP sockets and destroying the sync swarm
   *
   * @param {object} options
   * @param {number} options.timeout
   * @param {AbortSignal} [options.signal]
   * @returns {Promise<void>}
   */
  async _closeSyncWithTimeout({ timeout, signal }) {
    const mapeoCoreSync = this.core.sync;

    return new Promise((resolve, reject) => {
      if (signal) {
        if (signal.aborted) return;
        signal.addEventListener("abort", abort, { once: true });
      }

      // Wait for up to 30 minutes for replication to complete
      const timeoutId = setTimeout(() => {
        done(new Error("Timeout waiting for replication to complete"));
      }, timeout);

      checkIfDone();

      function checkIfDone() {
        if (signal && signal.aborted) abort();
        const currentlyReplicatingPeers = mapeoCoreSync.peers().filter(
          /** @param {any} peer */
          peer =>
            peer.state &&
            (peer.state.topic === "replication-started" ||
              peer.state.topic === "replication-progress")
        );
        log(currentlyReplicatingPeers.length + " peers still replicating");
        if (currentlyReplicatingPeers.length === 0) done();
        else mapeoCoreSync.once("down", checkIfDone);
      }

      function abort() {
        // don't close sync if we abort
        clearTimeout(timeoutId);
        mapeoCoreSync.removeListener("down", checkIfDone);
        resolve();
      }

      /** @param {Error} [err] */
      function done(err) {
        clearTimeout(timeoutId);
        mapeoCoreSync.removeListener("down", checkIfDone);
        if (signal) signal.removeEventListener("abort", abort);
        mapeoCoreSync.close(() => {
          if (err) reject(err);
          else resolve();
        });
      }
    });
  }
}

module.exports = Mapeo;
