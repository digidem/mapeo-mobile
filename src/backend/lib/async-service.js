// @ts-check
const { TypedEmitter } = require("tiny-typed-emitter");

/** @typedef {import('./types').AsyncServiceState } AsyncServiceState */

/**
 * @typedef {Object} InternalEvents
 * @property {() => void} started
 * @property {() => void} stopped
 * @property {(error: Error) => void} error
 * @property {(state: AsyncServiceState) => void} state
 */

/**
 * A helper class for managing a service that has asynchronous "start" and
 * "stop" methods. The implementing class can define async `_start()` and
 * `_stop()` methods. It manages state following some basic rules:
 *
 * - Most importantly: You can call start() and stop() multiple times, but the
 *   service will end in the state of the last call (e.g. if the last call was
 *   to `stop()` then it will end up stopped)
 * - Calling `start()` when the service is "stopped" calls the `_start()` method
 *   and resolves when it completes.
 * - Calling `start()` when the service is "starting" (e.g. `start()` has been
 *   called but has not completed) will not call `_start()` again, but will
 *   resolve once the service has started
 * - Calling `start()` when the service is "started" will resolve immediately
 *   and do nothing.
 * - If `_start()` or `_stop()` throw, then the service is left in an
 *   unrecoverable "error" state.
 * - Calling `start()` or `stop()` when the service is in "error" state will
 *   throw with the error from the error state
 *
 * Logic for calling `stop()` follows the inverse of `start()`.
 *
 *
 *
 * To wait for the service to be in the "started" state from other methods, use
 * `await this.started()`. Note that if the services is "stopping" or "stopped"
 * then this will await (e.g. queue) until next start
 *
 */
class AsyncService extends TypedEmitter {
  // These are private instance fields, just a precauttion against accidentally
  // overriding these in a class that extends this class.
  /** @type {AsyncServiceState} */
  #state = { value: "stopped" };
  /** @type {TypedEmitter<InternalEvents>} */
  #emitter = new TypedEmitter();

  /**
   * @protected
   * @returns {AsyncServiceState}
   */
  getState() {
    return this.#state;
  }

  /**
   * @private
   * @param {AsyncServiceState} state
   */
  _setState(state) {
    this.#state = state;
    if (state.value === "started") this.#emitter.emit("started");
    else if (state.value === "stopped") this.#emitter.emit("stopped");
    else if (state.value === "error") this.#emitter.emit("error", state.error);
    this.#emitter.emit("state", state);
  }

  /**
   * Attach a listener to changes of state.
   *
   * Author's note: This is written this way, rather than `this.emit()`, so that
   * subclasses can define their own events, so the events here remain an
   * implementation detail and are not exposed outside this class. It reduces
   * the public API of this helper class
   *
   * @protected
   * @param {(state: AsyncServiceState) => void} fn state listener function
   */
  addStateListener(fn) {
    this.#emitter.on("state", fn);
  }

  /**
   * Remove a listener to changes of state.
   *
   * @protected
   * @param {(state: AsyncServiceState) => void} fn state listener function
   */
  removeStateListener(fn) {
    this.#emitter.off("state", fn);
  }

  /**
   * To be overridden by implementing class
   *
   * @param {any[]} args
   */
  async _start(...args) {}
  /**
   * To be overridden by implementing class
   */
  async _stop() {}

  /**
   * Will resolve when the service is in started state. E.g. to ensure an async
   * method only runs when the service is in "started" state, use:
   *
   * ```js
   * await this.started()
   * ```
   *
   * Will reject if the service is in "error" state.
   *
   * Note: If the service is in "stopping" or "stopped" state this will queue
   * until the next time the service starts. If this is not desirable behaviour,
   * check this.#state.value first
   *
   * @readonly
   * @returns {Promise<void>}
   */
  async started() {
    if (this.#state.value === "started") return;
    if (this.#state.value === "error") throw this.#state.error;
    const emitter = this.#emitter;
    return new Promise((resolve, reject) => {
      emitter.once("started", onStarted);
      emitter.once("error", onError);
      function onStarted() {
        emitter.off("error", onError);
        resolve();
      }
      /** @param {Error} err */
      function onError(err) {
        emitter.off("started", onStarted);
        reject(err);
      }
    });
  }

  /**
   * Will resolve when the service is in stopped state. Less useful than
   * `started()` E.g. to ensure an async method only runs when the service is in
   * "stopped" state, use:
   *
   * ```js
   * await this.stopped()
   * ```
   *
   * Will reject if the service is in "error" state.
   *
   * Note: If the service is in "starting" or "started" state this will queue
   * until the next time the service stops. If this is not desirable behaviour,
   * check this.#state.value first
   *
   * @readonly
   * @returns {Promise<void>}
   */
  async stopped() {
    if (this.#state.value === "stopped") return;
    if (this.#state.value === "error") throw this.#state.error;
    const emitter = this.#emitter;
    return new Promise((resolve, reject) => {
      emitter.once("stopped", onStopped);
      emitter.once("error", onError);
      function onStopped() {
        emitter.off("error", onError);
        resolve();
      }
      /** @param {Error} err */
      function onError(err) {
        emitter.off("stopped", onStopped);
        reject(err);
      }
    });
  }

  /**
   * Start service. If the service is starting or started, will resolve when the
   * service is started, and will not call _start() for than once. If the
   * service is in the process of stopping, will wait until it stops before
   * starting and will not call _stop() more than once
   *
   * @readonly
   * @param {any[]} args
   * @returns {Promise<void>} Resolves when service is started
   */
  async start(...args) {
    switch (this.#state.value) {
      case "starting":
        await this.started();
        // Avoid race condition if another function is queued up
        return this.start(...args);
      case "started":
        return;
      case "error":
        return Promise.reject(this.#state.error);
      case "stopping":
        // Wait until stopped before continuing
        await this.stopped();
        // Avoid race condition if another function is queued up
        return this.start(...args);
      case "stopped":
      default:
      // Continue
    }
    try {
      this._setState({ value: "starting" });
      await this._start.apply(this, args);
      this._setState({ value: "started" });
    } catch (e) {
      this._setState({ value: "error", error: e });
      throw e;
    }
  }

  /**
   * Stop the service.
   *
   * @readonly
   * @returns {Promise<void>}
   */
  async stop() {
    switch (this.#state.value) {
      case "stopping":
        await this.stopped();
        return this.stop();
      case "stopped":
        return;
      case "error":
        return Promise.reject(this.#state.error);
      case "starting":
        // Wait until started until stopping
        await this.started();
        return this.stop();
      case "started":
      default:
      // Continue
    }
    try {
      this._setState({ value: "stopping" });
      await this._stop();
      this._setState({ value: "stopped" });
    } catch (e) {
      this._setState({ value: "error", error: e });
      throw e;
    }
  }
}

module.exports = AsyncService;
