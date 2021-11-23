// @ts-check
const { API_EVENT_NAME } = require("../constants");
const { TypedEmitter } = require("tiny-typed-emitter");
const rnBridge = require("rn-bridge");

/**
 * @typedef {Object} MessagePortEvents
 * @property {(value: any) => void} message
 */

/**
 * Wrap the nodejs-mobile RNBridge to act like a MessagePort. Queues messages
 * until `start()` is called.
 * @extends {TypedEmitter<MessagePortEvents>}
 */
class MessagePortLike extends TypedEmitter {
  /** @type {any[]} */
  #queuedMessages = [];
  /** @type {'idle' | 'started' | 'closed'} */
  #state = "idle";
  /** @type {(message: any) => void} */
  #messageHandler;

  constructor() {
    super();
    this.#messageHandler = message => {
      if (this.#state === "idle") {
        this.#queuedMessages.push(message);
      } else if (this.#state === "started") {
        this.emit("message", message);
      } else {
        // no-op if the port is closed
        // (the event listener should be removed anyway)
      }
    };
    rnBridge.channel.on(API_EVENT_NAME, this.#messageHandler);
  }

  start() {
    if (this.#state !== "idle") return;
    this.#state = "started";
    for (const msg of this.#queuedMessages) {
      this.emit("message", msg);
    }
    this.#queuedMessages = [];
  }

  close() {
    if (this.#state === "closed") return;
    rnBridge.channel.off(API_EVENT_NAME, this.#messageHandler);
    this.#state = "closed";
    this.#queuedMessages = [];
  }

  /**
   * @param {any} message
   * @returns {void}
   */
  postMessage(message) {
    rnBridge.channel.post(API_EVENT_NAME, message);
  }
}

module.exports = MessagePortLike;
