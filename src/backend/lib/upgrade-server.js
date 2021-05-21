// @ts-check

const { fastify: createFastify } = require("fastify");
const progressStream = require("progress-stream");
const { InstallerListSchema } = require("./schema");
const pump = require("pump");
const { stringifyInstaller } = require("./utils");
const throttle = require("lodash/throttle");
const AsyncService = require("./async-service");
const log = require("debug")("p2p-upgrades:server");

/** @typedef {import('fastify')} Fastify */
/** @typedef {import('./types').TransferProgress} Upload */
/**
 * @typedef {Object} Events
 * @property {(uploads: Upload[]) => void} uploads
 * @property {(error?: Error) => void} error
 */

// How frequently to emit progress events (in ms)
const EMIT_THROTTLE_MS = 400; // milliseconds

// Only use logger in development when debugging
const serverLogger = process.env.DEBUG
  ? require("pino")({ prettyPrint: { singleLine: true } })
  : false;

/**
 * @extends {AsyncService<Events, [number]>}
 */
class UpgradeServer extends AsyncService {
  #port = 0;
  /**
   * @param {object} options
   * @param {InstanceType<typeof import('./upgrade-storage')>} options.storage
   * @param {import('fastify').FastifyServerOptions['logger']} [options.logger]
   */
  constructor({ storage, logger = serverLogger }) {
    super();
    /** @private */
    this._storage = storage;
    /**
     * @private
     * @type {Set<Upload>}
     */
    this._uploads = new Set();

    // TODO: Only turn on logger in dev mode, since this has a perf overhead
    // in react native
    /** @private */
    this._fastify = createFastify({ logger });

    this._fastify.get(
      "/installers",
      { schema: { response: { 200: InstallerListSchema } } },
      this._listInstallersRoute.bind(this)
    );
    this._fastify.get("/installers/:id", this._getInstallerRoute.bind(this));

    // Even though each progress stream is throttled, if there are multiple
    // uploads at the same time, we still want to throttle the combination of
    // all progress events
    this.throttledEmitUploads = throttle(() => {
      this.emit("uploads", Array.from(this._uploads));
      // Avoid generating string for log unless in debug mode
      if (process.env.DEBUG) {
        if (!this._uploads.size) return log(`${this.#port}: 0 active uploads`);
        const progressString = Array.from(this._uploads)
          .map(
            ({ sofar, total, id }) =>
              `${id.slice(0, 7)}:${Math.round(sofar / total)}%`
          )
          .join(" ");
        log(
          `${this.#port}: ${
            this._uploads.size
          } active uploads: ${progressString}`
        );
      }
    }, EMIT_THROTTLE_MS);
  }

  /**
   * @private
   * @param {import('./types').Request<{ Params: { id: string }}>} request
   * @param {import('fastify').FastifyReply} reply
   */
  async _getInstallerRoute(request, reply) {
    const installer = await this._storage.get(request.params.id);
    if (!installer) {
      reply.statusCode = 404;
      return reply.callNotFound();
    }
    log(`${this.#port}: Upload started: ${stringifyInstaller(installer)}`);

    /** @type {Upload} */
    const upload = { id: installer.hash, sofar: 0, total: installer.size };

    const readStream = this._storage.createReadStream(request.params.id);
    const progress = progressStream({ length: installer.size }, progress => {
      upload.sofar = progress.transferred;
      this.throttledEmitUploads();
    });

    await reply.send(
      pump(readStream, progress, e => {
        if (e)
          log(
            `${this.#port}: Error uploading ${installer.hash.slice(0, 7)}`,
            e
          );
        else
          log(`${this.#port}: Uploaded complete ${installer.hash.slice(0, 7)}`);
      })
    );
    // Reply is now finished
    this._uploads.delete(upload);
    this.throttledEmitUploads();
  }

  /**
   * @private
   * @param {import('fastify').FastifyRequest} request
   * @param {import('./types').Reply<{ Reply: import('./types').InstallerExt[] }>} reply
   */
  async _listInstallersRoute(request, reply) {
    const urlBase = `${request.protocol}://${request.hostname}${request.routerPath}`;
    const installers = (await this._storage.list()).map(installer => {
      const { filepath, ...rest } = installer;
      return { ...rest, url: urlBase + "/" + installer.hash };
    });
    log(
      `List installers: ${installers
        .map(i => stringifyInstaller(i))
        .join(" \n")}`
    );
    reply.send(installers);
  }

  /**
   * Start the server on the specified port. Listen on all interfaces.
   *
   * @param {number} port
   * @returns {Promise<void>} Resolves when server is started
   */
  async _start(port) {
    this.#port = port;
    log(`${this.#port}: starting`);
    await this._fastify.listen(this.#port, "0.0.0.0");
    log(`${this.#port}: started`);
  }

  /**
   * Stop the server from accepting new connections. Will resolve when all
   * active connections are closed
   *
   * @returns {Promise<void>}
   */
  async _stop() {
    log(`${this.#port}: stopping`);
    await this._fastify.close();
    log(`${this.#port}: stopped`);
  }
}

module.exports = UpgradeServer;
