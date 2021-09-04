import Bugsnag from "@bugsnag/react-native";
import semverPrerelease from "semver/functions/prerelease";
import { version } from "../../../package.json";

const prereleaseComponents = semverPrerelease(version);
const releaseStage = __DEV__
  ? "development"
  : prereleaseComponents
  ? prereleaseComponents[0]
  : "production";

Bugsnag.start({ releaseStage });

export default Bugsnag;
