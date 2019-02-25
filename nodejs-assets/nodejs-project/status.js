const rnBridge = require("rn-bridge");
const debug = require("debug")("mapeo-core:status");
const constants = require("./constants");

class ServerStatus {
  constructor() {
    this.setState(constants.STARTING);
  }
  startHeartbeat() {
    this.intervalId = setInterval(() => {
      rnBridge.channel.post("status", serverState);
    }, 2000);
  }
  pauseHeartbeat() {
    clearInterval(this.intervalId);
  }
  setState(nextState) {
    if (nextState === this.state) return;
    debug("state changed", nextState);
    this.state = nextState;
    rnBridge.channel.post("status", nextState);
  }
}

module.exports = ServerStatus;
