const rnBridge = require("rn-bridge");
const log = require("debug")("mapeo-core:status");
const constants = require("./constants");
const main = require("./index");

class ServerStatus {
  constructor() {
    this.setState(constants.IDLE);
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
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
  getState() {
    return this.state;
  }
  setState(nextState, { error, context } = {}) {
    if (nextState === this.state) return;
    log("state changed", nextState);
    // Once we have an uncaught error, don't try to pretend it's gone away
    if (this.state === constants.ERROR) return;
    if (nextState === constants.ERROR) {
      error = error || new Error("Unknown server error");
      log(error.message);
      main.bugsnag.notify(error, { context });
    }
    this.state = nextState;
    rnBridge.channel.post("status", {
      value: nextState,
      error: error && error.message,
      context
    });
  }
}

module.exports = ServerStatus;
