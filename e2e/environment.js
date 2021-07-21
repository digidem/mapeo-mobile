// Source: https://github.com/wix/Detox/blob/06660be1b08a46c4ab9097ee39462c21537cfc0c/examples/demo-react-native-jest/e2e/environment.js

const {
  DetoxCircusEnvironment,
  SpecReporter,
  WorkerAssignReporter,
} = require("detox/runners/jest-circus");

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  constructor(config, context) {
    super(config, context);

    // Can be safely removed, if you are content with the default value (=300000ms)
    this.initTimeout = 300000;

    // This takes care of generating status logs on a per-spec basis. By default, Jest only reports at file-level.
    // This is strictly optional.
    this.registerListeners({
      SpecReporter,
      WorkerAssignReporter,
    });
  }
}

module.exports = CustomDetoxEnvironment;
