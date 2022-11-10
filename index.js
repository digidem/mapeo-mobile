// @flow
// setup bugsnag before anything else
import "./src/frontend/lib/logger";
import "./src/frontend/polyfills";

import { AppRegistry } from "react-native";
import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions";
import App from "./src/frontend/App";
import { name as appName } from "./app.json";

initializePolyfills();

AppRegistry.registerComponent(appName, () => App);

// Mostly taken from what's done in https://github.com/acostalima/react-native-polyfill-globals
function initializePolyfills() {
  // Polyfill TextEncoder and TextDecoder
  require("fast-text-encoding");

  // Polyfill ReadableStream
  const { ReadableStream } = require("web-streams-polyfill/ponyfill/es6");

  polyfillGlobal("ReadableStream", () => ReadableStream);

  const {
    fetch,
    Headers,
    Request,
    Response,
  } = require("react-native-fetch-api");

  // Polyfill fetch
  polyfillGlobal("fetch", () => fetch);
  polyfillGlobal("Headers", () => Headers);
  polyfillGlobal("Request", () => Request);
  polyfillGlobal("Response", () => Response);

  // Polyfill window object (needed for @microsoft/fetch-event-source)
  polyfillGlobal("window", () => ({
    ...(global.window || {}),
    setTimeout,
    clearTimeout,
    fetch,
  }));

  // Polyfill document object (needed for @microsoft/fetch-event-source)
  polyfillGlobal("document", () => ({
    ...(global.document || {}),
    hidden: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}
