const UPGRADE_INFO_FILENAME = "upgrades.json";

const UpgradeState = {
  Search: {
    Idle: "IDLE",
    Searching: "SEARCHING",
    Error: "ERROR",
  },

  Download: {
    Idle: "IDLE",
    Downloading: "DOWNLOADING",
    Error: "ERROR",
  },

  Check: {
    NotAvailable: "NOT_AVAILABLE",
    Available: "AVAILABLE",
    Error: "ERROR",
  },

  Server: {
    Idle: "IDLE",
    Sharing: "SHARING",
    Draining: "DRAINING",
    Error: "ERROR",
  },
};

module.exports = {
  UPGRADE_INFO_FILENAME,
  UpgradeState,
};
