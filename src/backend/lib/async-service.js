const { TypedEmitter } = require("tiny-typed-emitter");
const pDefer = require("p-defer");

/** @typedef {import('./types').AsyncServiceStateDefault } AsyncServiceStateDefault */

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
 * The default `setState()` and `getState()` methods can be overridden to
 * augment state with additional context, or to emit events when `setState()` is
 * called. Custom state must extend the default state `AsyncServiceStateDefault`
 * (see `./types.d.ts`).
 *
 * To wait for the service to be in the "started" state from other methods, use
 * `await this.started()`. Note that if the services is "stopping" or "stopped"
 * then this will await (e.g. queue) until next start
 *
 */
class AsyncService extends TypedEmitter {
  // These are private instance fields, just a precauttion against accidentally
  // overriding these in a class that extends this class.
  /** @type {AsyncServiceStateDefault} */
  #state = { value: "stopped" };
  /** @type {import('p-defer').DeferredPromise<void> */
  #started = pDefer();
  // We initialize in "stopped" state, so "#stopped" promise is initialized as resolved
  /** @type {import('p-defer').DeferredPromise<void> } */
  #stopped = {
    promise: Promise.resolve(),
    resolve: () => {},
    reject: () => {},
  };

  /** @param {AsyncServiceStateDefault} newState */
  setState(newState) {
    this.#state = newState;
  }

  /** @returns {AsyncServiceStateDefault} */
  getState() {
    return this.#state;
  }

  /**
   * To be overridden by implementing class
   *
   * @param {any[]} [args]
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
   * check this.getState().value first
   *
   * @readonly
   * @returns {Promise<void>}
   */
  async started() {
    return this.#started.promise;
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
   * check this.getState().value first
   *
   * @readonly
   * @returns {Promise<void>}
   */
  async stopped() {
    return this.#started.promise;
  }

  /**
   * Start service. If the service is starting or started, will resolve when the
   * service is started, and will not call _start() for than once. If the
   * service is in the process of stopping, will wait until it stops before
   * starting and will not call _stop() more than once
   *
   * @readonly
   * @param {any[]} [args]
   * @returns {Promise<void>} Resolves when service is started
   */
  async start(...args) {
    switch (this.getState().value) {
      case "starting":
      case "started":
        // Will still resolve once has started
        return this.#started.promise;
      case "error":
        return Promise.reject(this.getState().error);
      case "stopping":
        // Wait until stopped before continuing
        await this.#stopped.promise;
        break;
      case "stopped":
        break;
      default: {
        const error = new Error("Should not happen");
        this.setState({ value: "error", error });
        return this.#started.reject(error);
      }
    }
    // We've begun starting, so stopping promise needs to be unresolved until
    // we stop again
    this.#stopped = pDefer();
    try {
      this.setState({ value: "starting" });
      await this._start.apply(this, args);
      this.setState({ value: "started" });
      this.#started.resolve();
    } catch (e) {
      this.setState({ value: "error", error: e });
      this.#started.reject(e);
    }
    return this.#started.promise;
  }

  /**
   * Stop the service.
   *
   * @returns {Promise<void>}
   */
  async stop() {
    switch (this.getState().value) {
      case "stopping":
      case "stopped":
        // Resolve once stopped
        return this.#stopped.promise;
      case "error":
        return Promise.reject(this.getState().error);
      case "starting":
        // Wait until started until stopping
        await this.#started.promise;
        break;
      case "started":
        break;
      default: {
        const error = new Error("Should not happen");
        this.setState({ value: "error", error });
        return this.#stopped.reject(error);
      }
    }
    // We've begun stopping, so starting promise needs to be unresolved until
    // we start again
    this.#started = pDefer();
    try {
      this.setState({ value: "stopping" });
      await this._stop();
      this.setState({ value: "stopped" });
      this.#stopped.resolve();
    } catch (e) {
      this.setState({ value: "error", error: e });
      this.#stopped.reject(e);
    }
    return this.#stopped.promise;
  }
}

module.exports = AsyncService;
