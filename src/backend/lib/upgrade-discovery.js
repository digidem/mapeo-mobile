// @ts-check

const got = require("got").default;
const AsyncService = require("./async-service");
const createDiscovery = require("dns-discovery");
const secureJson = require("secure-json-parse");
const { isInstallerList } = require("./schema");
const throttle = require("lodash/throttle");
const stream = require("stream");
const { stringifyInstaller } = require("./utils");
const log = require("debug")("p2p-upgrades:discovery");

// TTL for discovered peers, if they are not seen for more than this period then
// they are considered offline and forgotten
const PEER_TTL_MS = 4000;

/** @typedef {import('fastify')} Fastify */
/** @typedef {import('./types').TransferProgress} Download */
/** @typedef {import('./types').InstallerExt} InstallerExt */
/**
 * @typedef {Object} Events
 * @property {(installers: InstallerExt[]) => void} installers
 * @property {(error?: Error) => void} error
 */

/**
 * Maintain a list of available installers from discovered peers. Will keep the
 * list updated if peers become unavailable, or if a peer has deleted their
 * installer. Also announces this device and listens for other peers on the
 * local network
 *
 * @extends {AsyncService<Events, [number]>}
 */
class UpgradeDiscovery extends AsyncService {
  #port = 0;
  #discoveryKey;
  #lookupInterval;
  /** @type {NodeJS.Timeout} */
  #discoveryInterval;
  /** @type {import('lodash').DebouncedFunc<void>} */
  #throttledEmitInstallers;
  /**
   * Store installers by hash, replacing any existing one with most recently
   * seen. In the future maybe store references to copies on different peers?
   * Could prefer the peer with best connection?
   *
   * @type {Map<string, { installer: InstallerExt, timeoutId: NodeJS.Timeout}>}
   */
  #availableInstallers = new Map();
  /**
   * Track in-progress requests to GET /installers to avoid calling multiple
   * times when the first is in progress
   *
   * @type {Set<string>}
   */
  #inProgressRequests = new Set();
  /** @type {ReturnType<import('dns-discovery')>} */
  #discovery;

  /**
   *Creates an instance of UpgradeDiscovery.
   * @param {object} options
   * @param {string} options.discoveryKey discovery key for lookups
   * @param {number} [options.installerEmitThrottle=5000] number of ms to wait between emitting a list of available installers - mainly used for testing,
   * @param {number} [options.lookupInterval=2000] How frequently (in ms) to query other peers for available upgrades - mainly for testing
   */
  constructor({
    discoveryKey,
    installerEmitThrottle = 5000,
    lookupInterval = 2000,
  }) {
    super();
    this.#discoveryKey = discoveryKey;
    this.#lookupInterval = lookupInterval;
    // Private instance methods (vs. fields) are not supported in Node v12
    /** @private */
    this._onPeer = this._onPeer.bind(this);
    this.#throttledEmitInstallers = throttle(
      () => {
        // Flushed when the service stops (so will not emit after stop)
        this.emit(
          "installers",
          Array.from(this.#availableInstallers.values()).map(
            value => value.installer
          )
        );
      },
      installerEmitThrottle,
      { leading: false, trailing: true }
    );
  }

  /**
   * Create a readstream for an available installer from another peer
   *
   * @param {string} hash
   * @returns {import('stream').Readable}
   */
  createReadStream(hash) {
    const installer = this.#availableInstallers.get(hash);
    if (installer) {
      log(
        `${this.#port}: Starting download: ${stringifyInstaller(
          installer.installer
        )} from ${
          // @ts-ignore
          new URL(installer.installer.url).host
        }`
      );
      const downloadStream = got.stream(installer.installer.url);
      downloadStream.once("error", e => {
        log(`${this.#port}: Download error for ${hash.slice(0, 7)}:`, e);
        // Remove from available installers - probably errored because no longer
        // available
        clearTimeout(installer.timeoutId);
        this.#availableInstallers.delete(hash);
        this.#throttledEmitInstallers();
      });
      stream.finished(downloadStream, e => {
        if (!e) log(`${this.#port}: Download complete: ${hash.slice(0, 7)}`);
      });
      return downloadStream;
    }
    // If an installer matching this has is no longer tracked as "available", return a fake stream that instantly errors
    log(`${this.#port}: Installer not available ${hash.slice(0, 7)}`);
    const brokenStream = new stream.Readable({ read() {} });
    process.nextTick(() => brokenStream.emit("error", new Error("NotFound")));
    return brokenStream;
  }

  /**
   * Start downloader service
   *
   * @param {number} port
   */
  async _start(port) {
    this.#port = port;
    log(`${this.#port}: starting`);
    this.#discovery = createDiscovery({
      server: [],
      loopback: false,
    });
    this.#discovery.announce(this.#discoveryKey, port);
    this.#discovery.on("peer", this._onPeer);
    this.#discoveryInterval = setInterval(() => {
      // Announce only needs to happen once, but lookup needs to happen on an
      // interval so we can check whether peers are still available
      this.#discovery.lookup(this.#discoveryKey);
    }, this.#lookupInterval);
    log(`${this.#port}: started`);
  }

  /**
   * Stop downloader service
   *
   * @returns {Promise<void>}
   */
  async _stop() {
    log(`${this.#port}: stopping`);
    return new Promise(resolve => {
      this.#discoveryInterval && clearInterval(this.#discoveryInterval);
      this.#discovery.off("peer", this._onPeer);
      // Flush throttled installer emit
      this.#throttledEmitInstallers.flush();
      // NB: Due to a bug in dns-discovery, the callback is always called with
      // an error, but we can safely ignore it
      this.#discovery.unannounce(this.#discoveryKey, this.#port, () => {
        this.#discovery.destroy(() => {
          log(`${this.#port}: stopped`);
          resolve();
        });
      });
    });
  }

  /**
   * @private
   * @param {string} app The app name the peer was discovered for.
   * @param {object} peer
   * @param {string} peer.host The address of the peer
   * @param {number} peer.port The port the peer is listening on
   */
  async _onPeer(app, { host, port }) {
    if (app !== this.#discoveryKey) return;
    const listUrl = `http://${host}:${port}/installers`;
    // If we are currently querying this peer, bail
    if (this.#inProgressRequests.has(listUrl)) return;
    this.#inProgressRequests.add(listUrl);
    let installers;
    try {
      log(`${this.#port}: Querying peer ${host}:${port}`);
      // Secure parse of JSON to avoid prototype pollution
      installers = await got(listUrl, {
        parseJson: text => secureJson.parse(text),
      }).json();
      // Validate response
      if (!isInstallerList(installers)) throw isInstallerList.errors;
    } catch (e) {
      log(`${this.#port}: Error querying peer ${host}:${port}`, e);
      // If we get an error trying to connect to a peer, then remove any
      // installers from that host from our list of available installers
      // TODO: Emit an error here, mainly for testing
      for (const { installer } of this.#availableInstallers.values()) {
        if (installer.url.startsWith(`http://${host}:${port}`)) {
          log(
            `${
              this.#port
            }: removing from available from ${host}:${port}: ${stringifyInstaller(
              installer
            )}`
          );
          this.#availableInstallers.delete(installer.hash);
        }
      }
      this.#inProgressRequests.delete(listUrl);
      return;
    }
    for (const installer of installers) {
      const { hash } = installer;
      const existing = this.#availableInstallers.get(hash);
      if (existing) {
        clearTimeout(existing.timeoutId);
        this.#availableInstallers.delete(hash);
      }
      log(
        `${this.#port}: ${host}:${port} available: ${stringifyInstaller(
          installer
        )}`
      );
      this.#availableInstallers.set(hash, {
        installer,
        timeoutId: setTimeout(() => {
          log(
            `${this.#port}: TTL for ${stringifyInstaller(
              installer
            )} from ${host}:${port}`
          );
          this.#availableInstallers.delete(hash);
          this.#throttledEmitInstallers();
        }, PEER_TTL_MS),
      });
    }
    this.#inProgressRequests.delete(listUrl);
    this.#throttledEmitInstallers();
  }
}

module.exports = UpgradeDiscovery;
