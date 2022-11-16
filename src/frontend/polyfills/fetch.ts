// @ts-ignore
import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions";

// Polyfill TextEncoder and TextDecoder
require("fast-text-encoding");

// Polyfill ReadableStream
const { ReadableStream } = require("web-streams-polyfill/ponyfill/es6");

polyfillGlobal("ReadableStream", () => ReadableStream);

const { fetch, Headers, Request, Response } = require("react-native-fetch-api");

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
