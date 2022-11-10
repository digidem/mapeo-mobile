// @flow
// setup bugsnag before anything else
import "./src/frontend/lib/logger";
import "./src/frontend/polyfills";

import { AppRegistry } from "react-native";
import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions";
import App from "./src/frontend/App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
