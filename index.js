// @flow
// For better error handling with the dev client
import "expo-dev-client";
// setup bugsnag before anything else
import "./src/frontend/lib/logger";
import { AppRegistry } from "react-native";
import App from "./src/frontend/App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
