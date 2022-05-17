const { promisify } = require("util");
const createServer = require("@mapeo/map-server").default;
const log = require("debug")("map-server");

const AsyncService = require("./async-service/async-service");

class MapServer extends AsyncService {
  /** @type {number?} */
  #port;
  /** @type {import('fastify').FastifyInstance} */
  #fastify;

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
   * @param {number} port
   * @returns {Promise<void>} Resolves when server is started
   */
  async _start(port) {
    this.#port = port;
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
}

module.exports = MapServer;
