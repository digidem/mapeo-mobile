/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const blacklist = require("metro-config/src/defaults/blacklist");
const defaultSourceExts = require("metro-config/src/defaults/defaults")
  .sourceExts;

const customSourceExts = [];

if (process.env.APP_VARIANT) {
  const match = process.env.APP_VARIANT.match(/^[^A-Z]*/);
  if (match) {
    customSourceExts.push(match[0] + ".js");
  }
}

if (process.env.RN_SRC_EXT) {
  process.env.RN_SRC_EXT.split(",").forEach(ext => {
    customSourceExts.push(ext);
  });
}

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
    minifierPath: "metro-minify-esbuild",
    minifierConfig: {},
  },
  resolver: {
    blacklistRE: blacklist([/nodejs-assets\/.*/, /android\/.*/, /ios\/.*/]),
    sourceExts: customSourceExts.concat(defaultSourceExts),
  },
};
