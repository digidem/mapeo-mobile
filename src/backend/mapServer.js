const { promisify } = require("util");
const getPort = require("get-port");
const createServer = require("@mapeo/map-server").default;
const log = require("debug")("map-server");

const AsyncService = require("./upgrade-manager/async-service");

// TODO: Does it make sense for this to extend AsyncService?
class MapServer extends AsyncService {
  /** @type {number?} */
  #port;
  /** @type {import('fastify').FastifyInstance} */
  #fastify;

  /** @type {boolean} */
  #fastifyStarted = false;

  /**
   * @param {object} object
   * @param {string} dbPath
   *
   */
  constructor({ dbPath }) {
    super();
    this.#fastify = createServer({ logger: false }, { dbPath });
  }

  /**
   * Start the server on the specified port. Listen on all interfaces.
   *
   * @returns {Promise<number>} Resolves with the port number when server is started
   */
  async _start() {
    // TODO: This seems to not maintain the previous port when resuming - is that expected/okay?
    this.#port = await getPort({ port: this.#port || undefined });
    log(`${this.#port}: starting`);
    if (!this.#fastifyStarted) {
      log("first start, initializing fastify");
      await this.#fastify.listen(this.#port, "0.0.0.0");
      this.#fastifyStarted = true;
    } else {
      log("second start, listening");
      const { server } = this.#fastify;
      await promisify(server.listen.bind(server))(this.#port, "0.0.0.0");
    }
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
    const { server } = this.#fastify;
    await promisify(server.close.bind(server))();
    log(`${this.#port}: stopped`);
  }

  get port() {
    return this.#port;
  }
}

module.exports = MapServer;
