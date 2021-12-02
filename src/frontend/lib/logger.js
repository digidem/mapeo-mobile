import Bugsnag from "@bugsnag/react-native";
import semverPrerelease from "semver/functions/prerelease";
import { version } from "../../../package.json";

let initialized = false;

if (!initialized) {
  const prereleaseComponents = semverPrerelease(version);

  Bugsnag.start({
    releaseStage: __DEV__
      ? "development"
      : prereleaseComponents
      ? prereleaseComponents[0]
      : "production",
  });

  initialized = true;
}

export default Bugsnag;
