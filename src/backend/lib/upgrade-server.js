// @ts-check

const { fastify: createFastify } = require("fastify");
const progressStream = require("progress-stream");
const { InstallerListSchema } = require("./schema");
const pump = require("pump");
const throttle = require("lodash/throttle");
const AsyncService = require("./async-service");

/** @typedef {import('fastify')} Fastify */
/** @typedef {import('./types').TransferProgress} Upload */
/**
 * @typedef {Object} Events
 * @property {(uploads: Upload[]) => void} uploads
 * @property {(error?: Error) => void} error
 */

// How frequently to emit progress events (in ms)
const EMIT_THROTTLE_MS = 400; // milliseconds

/**
 * @extends {AsyncService<Events, [number]>}
 */
class UpgradeServer extends AsyncService {
  /**
   * @param {object} options
   * @param {InstanceType<typeof import('./upgrade-storage')>} options.storage
   * @param {import('fastify').FastifyServerOptions['logger']} [options.logger]
   */
  constructor({ storage, logger }) {
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

    /** @type {Upload} */
    const upload = { id: installer.hash, sofar: 0, total: installer.size };

    const readStream = this._storage.createReadStream(request.params.id);
    const progress = progressStream({ length: installer.size }, progress => {
      upload.sofar = progress.transferred;
      this.throttledEmitUploads();
    });

    await reply.send(pump(readStream, progress));
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
    reply.send(installers);
  }

  /**
   * Start the server on the specified port. Listen on all interfaces.
   *
   * @param {number} port
   * @returns {Promise<void>} Resolves when server is started
   */
  async _start(port) {
    await this._fastify.listen(port, "0.0.0.0");
  }

  /**
   * Stop the server from accepting new connections. Will resolve when all
   * active connections are closed
   *
   * @returns {Promise<void>}
   */
  async _stop() {
    await this._fastify.close();
  }
}

module.exports = UpgradeServer;
