// @flow
import { AppRegistry } from "react-native";
import App from "./src/frontend/App";
import { name as appName } from "./app.json";
import { Client } from "bugsnag-react-native";

const bugsnag = new Client("572d472ea9d5a9199777b88ef268da4e");

bugsnag.notify(new Error("Test error"));

AppRegistry.registerComponent(appName, () => App);
