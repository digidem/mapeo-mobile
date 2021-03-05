const DISCOVERY_KEY = "mapeo-upgrade";
const UPGRADE_INFO_FILENAME = "upgrades.json";

const UpgradeState = {
  Search: {
    Idle: 1,
    Searching: 2,
    Error: 3,
  },

  Download: {
    Idle: 1,
    Downloading: 2,
    Downloaded: 3,
    Error: 4,
  },

  Check: {
    NotAvailable: 1,
    Available: 2,
    Error: 3,
  },

  Server: {
    Idle: 1,
    Sharing: 2,
    Draining: 3,
    Error: 4,
  },
};

module.exports = {
  DISCOVERY_KEY,
  UPGRADE_INFO_FILENAME,
  UpgradeState,
};
