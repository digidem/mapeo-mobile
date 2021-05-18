// @ts-check

const got = require("got").default;
const AsyncService = require("./async-service");
const createDiscovery = require("dns-discovery");
const secureJson = require("secure-json-parse");
const { isInstallerList } = require("./schema");
const throttle = require("lodash/throttle");
const stream = require("stream");
const log = require("debug")("p2p-upgrades:discovery");

// How frequently to query other peers for available upgrades
const LOOKUP_INTERVAL = 2000; // milliseconds
// TTL for discovered peers, if they are not seen for more than this period then
// they are considered offline and forgotten
const TTL = 4000;
// How frequently to emit changes to the installers available to download
const EMIT_THROTTLE = 1000;

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
  #port = 3000;
  /**
   * Store installers by hash, replacing any existing one with most recently
   * seen. In the future maybe store references to copies on different peers?
   * Could prefer the peer with best connection?
   *
   * @type {Map<string, { installer: InstallerExt, timeoutId: NodeJS.Timeout}>}
   */
  #availableInstallers = new Map();

  /**
   *Creates an instance of UpgradeServer.
   * @param {object} options
   * @param {InstanceType<typeof import('./upgrade-storage')>} options.storage Instance of UpgradeStorage
   * @param {string} options.discoveryKey discovery key for lookups
   */
  constructor({ storage, discoveryKey }) {
    super();
    /** @private */
    this._storage = storage;
    /** @private */
    this._discoveryKey = discoveryKey;
    /** @private */
    this._discovery = createDiscovery({
      server: [],
      loopback: false,
    });
    /** @private */
    this._onPeer = this._onPeer.bind(this);
    /** @private */
    this._throttledEmitInstallers = throttle(() => {
      this.emit(
        "installers",
        Array.from(this.#availableInstallers.values()).map(
          value => value.installer
        )
      );
    }, EMIT_THROTTLE);
  }

  /**
   * Create a readstream for an available installer from another peer
   *
   * @param {string} hash
   * @returns {import('stream').Readable}
   */
  createReadSteam(hash) {
    const installer = this.#availableInstallers.get(hash);
    if (installer) {
      const stream = got.stream(installer.installer.url);
      stream.on("error", e => {
        log("Download error", e);
        // Remove from available installers - probably errored because no longer
        // available
        clearTimeout(installer.timeoutId);
        this.#availableInstallers.delete(hash);
      });
      return stream;
    }
    // If an installer matching this has is no longer tracked as "available", return a fake stream that instantly errors
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
    this._discovery.announce(this._discoveryKey, port);
    this._discovery.on("peer", this._onPeer);
    this._discoveryInterval = setInterval(() => {
      // Announce only needs to happen once, but lookup needs to happen on an
      // interval so we can check whether peers are still available
      this._discovery.lookup(this._discoveryKey);
    }, LOOKUP_INTERVAL);
  }

  /**
   * Stop downloader service
   *
   * @returns {Promise<void>}
   */
  async _stop() {
    return new Promise(resolve => {
      this._discoveryInterval && clearInterval(this._discoveryInterval);
      this._discovery.off("peer", this._onPeer);
      // NB: Due to a bug in dns-discovery, the callback is always called with
      // an error, but we can safely ignore it
      this._discovery.unannounce(this._discoveryKey, this.#port, () =>
        resolve()
      );
    });
  }

  /**
   * @param {string} app The app name the peer was discovered for.
   * @param {object} peer
   * @param {string} peer.host The address of the peer
   * @param {number} peer.port The port the peer is listening on
   */
  async _onPeer(app, { host, port }) {
    if (app && app !== this._discoveryKey) return;
    /** @type  */
    let installers;
    try {
      const listUrl = `http://${host}:${port}/installers`;
      // Secure parse of JSON to avoid prototype pollution
      installers = await got(listUrl, {
        parseJson: text => secureJson.parse(text),
      }).json();
      // Validate response
      if (!isInstallerList(installers)) throw isInstallerList.errors;
    } catch (e) {
      // If we get an error trying to connect to a peer, then remove any
      // installers from that host from our list of available installers
      for (const { installer } of this.#availableInstallers.values()) {
        if (installer.url.startsWith(`http://${host}:${port}`)) {
          this.#availableInstallers.delete(installer.hash);
        }
      }
      return;
    }
    for (const installer of installers) {
      const { hash } = installer;
      const existing = this.#availableInstallers.get(hash);
      if (existing) {
        clearTimeout(existing.timeoutId);
        this.#availableInstallers.delete(hash);
      }
      this.#availableInstallers.set(hash, {
        installer,
        timeoutId: setTimeout(() => {
          this.#availableInstallers.delete(hash);
          this._throttledEmitInstallers();
        }, TTL),
      });
    }
    this._throttledEmitInstallers();
  }
}

module.exports = UpgradeDiscovery;
