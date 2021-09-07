import { Client, Configuration } from "@bugsnag/react-native";
import semverPrerelease from "semver/functions/prerelease";
import { version } from "../../../package.json";

const config = new Configuration("572d472ea9d5a9199777b88ef268da4e");
const prereleaseComponents = semverPrerelease(version);
config.releaseStage = __DEV__
  ? "development"
  : prereleaseComponents
  ? prereleaseComponents[0]
  : "production";
config.appVersion = version;
const bugsnag = new Client(config);

export default bugsnag;
