/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const blacklist = require("metro-config/src/defaults/blacklist");
const defaultSourceExts = require("metro-config/src/defaults/defaults")
  .sourceExts;

console.log("METRO", process.env.RN_SRC_EXT);

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    })
  },
  resolver: {
    blacklistRE: blacklist([/nodejs-assets\/.*/, /android\/.*/, /ios\/.*/]),
    sourceExts: process.env.RN_SRC_EXT
      ? process.env.RN_SRC_EXT.split(",").concat(defaultSourceExts)
      : defaultSourceExts
  }
};
