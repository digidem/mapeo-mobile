// @flow
// setup bugsnag before anything else
import "./src/frontend/lib/logger";
import { AppRegistry } from "react-native";
import App from "./src/frontend/App";
import { name as appName } from "./app.json";
import "./src/frontend/lib/polyfills";

AppRegistry.registerComponent(appName, () => App);
