/* eslint-env jest/globals */

import STATUS from "./../../backend/constants";

// const mockedApis = [
//   "getPresets",
//   "getFields",
//   "getMetadata",
//   "getConfigMessages",
// ];

// mockedApis.forEach(api => {
//   module.exports[api] = {
//     add: jest.fn(() => Promise.resolve())
//   };
// });

export { STATUS as Constants };

export default {
  getPresets: () => {
    return jest.fn(() => Promise.resolve());
  },
  getFields: () => {
    return jest.fn(() => Promise.resolve());
  },
  getMetadata: () => {
    return jest.fn(() => Promise.resolve());
  },
  getConfigMessages: () => {
    return jest.fn(() => Promise.resolve());
  },
  getObservations: () => jest.fn(() => Promise.resolve([])),
};
