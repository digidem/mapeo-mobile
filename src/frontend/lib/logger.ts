import Bugsnag from "@bugsnag/react-native";
// import semverPrerelease from "semver/functions/prerelease";
// import { version } from "../../../package.json";

// const prereleaseComponents = semverPrerelease(version);

Bugsnag.start({
  /**
   * TODO(andrew): release stage cannot be set from JS layer and must be done at native layer
   *
   * https://github.com/bugsnag/bugsnag-js/issues/1264#issuecomment-767191963
   * https://github.com/bugsnag/bugsnag-js/issues/1263#issuecomment-767193544
   * https://github.com/bugsnag/bugsnag-js/issues/1575#issuecomment-965002319
   */
  // releaseStage: __DEV__
  //   ? "development"
  //   : prereleaseComponents
  //   ? prereleaseComponents[0]
  //   : "production",
});

export default Bugsnag;
