import { API_EVENT_NAME } from "../../backend/constants";
import { TypedEmitter } from "tiny-typed-emitter";
import nodejs from "nodejs-mobile-react-native";

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
  #queuedMessages: any[] = [];
  #state: "idle" | "started" | "closed" = "idle";
  #messageHandler: (message: any) => void;

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
    nodejs.channel.addListener(API_EVENT_NAME, this.#messageHandler);
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
    nodejs.channel.removeListener(API_EVENT_NAME, this.#messageHandler);
    this.#state = "closed";
    this.#queuedMessages = [];
  }

  postMessage(message: any): void {
    nodejs.channel.post(API_EVENT_NAME, message);
  }
}

export default MessagePortLike;
