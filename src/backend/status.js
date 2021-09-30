// @ts-check
const rnBridge = require("rn-bridge");
const log = require("debug")("mapeo-core:status");
const main = require("./index");

class ServerStatus {
  constructor() {
    /** @type {import('./lib/types').BackendStateValue} */
    this.state = "idle";
    rnBridge.channel.post("status", { value: this.state });
    rnBridge.channel.on("request-status", () => {
      log("status request -> " + this.state);
      rnBridge.channel.post("status", { value: this.state });
    });
  }
  startHeartbeat() {
    log("Start heartbeat");
    if (this.intervalId) return; // Don't have two heartbeats
    this.intervalId = setInterval(() => {
      rnBridge.channel.post("status", { value: this.state });
    }, 4000);
  }
  pauseHeartbeat() {
    log("Pause heartbeat");
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
  }
  getState() {
    return this.state;
  }
  /**
   * @param {import('./lib/types').BackendStateValue} nextState
   * @param {object} [opts]
   * @param {Error} [opts.error]
   * @param {string} [opts.context]
   */
  setState(nextState, { error, context } = {}) {
    if (nextState === this.state) return;
    log("state changed", nextState);
    // Once we have an uncaught error, don't try to pretend it's gone away
    if (this.state === "error") return;
    if (nextState === "error") {
      error = error || new Error("Unknown server error");
      log(context, error.message);
      main.bugsnag.notify(error, { context });
    }
    this.state = nextState;
    rnBridge.channel.post("status", {
      value: nextState,
      error: error && error.message,
      context,
    });
  }
}

module.exports = ServerStatus;
