// Source: https://github.com/wix/Detox/blob/06660be1b08a46c4ab9097ee39462c21537cfc0c/examples/demo-react-native-jest/e2e/global-teardown.js

const detox = require("detox");

async function globalTeardown() {
  await detox.globalCleanup();
}

module.exports = globalTeardown;
