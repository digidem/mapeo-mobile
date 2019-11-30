const path = require("path");
const blacklist = require("metro-config/src/defaults/blacklist");

const glob = require("glob-to-regexp");

module.exports = {
  watchFolders: [
    // The monorepo
    path.resolve(__dirname, "..")
  ],
  resolver: {
    blacklistRE: blacklist([
      /node_modules\/.*\/node_modules\/react\/.*/,
      /node_modules\/.*\/node_modules\/fbjs\/.*/,
      // exclude react-native modules outside of this package
      // /.*\/node_modules\/react-native\/.*/,
      /node_modules\/.*\/node_modules\/react-native\/.*/,
      // duplicate packages in server mocks. We don't need them so it's safe to exclude.
      /nodejs-assets\/.*/,
      /android\/.*/,
      /ios\/.*/,
      glob(`${path.resolve(__dirname, "..")}/node_modules/react/*`),
      glob(`${path.resolve(__dirname, "..")}/node_modules/@storybook/*`),
      glob(`${path.resolve(__dirname, "..")}/node_modules/react-native/*`),
      glob(
        `${path.resolve(
          __dirname,
          ".."
        )}/node_modules/react-native-vector-icons/*`
      ),
      glob(`${path.resolve(__dirname)}/node_modules/metro/node_modules/fbjs/*`),
      glob(`${path.resolve(__dirname)}/node_modules/fbjs/*`)
    ]),
    providesModuleNodeModules: ["react-native", "react", "fbjs"],
    extraNodeModules: {
      // resolve react-native to this package's node_modules
      "react-native": path.resolve(__dirname, "node_modules/react-native"),
      // resolve react to this package's node_modules
      react: path.resolve(__dirname, "node_modules/react"),
      "react-native-vector-icons": path.resolve(
        __dirname,
        "node_modules/@expo/vector-icons"
      ),
      "bugsnag-react-native": path.resolve(
        __dirname,
        "__mocks__/bugsnag-react-native.js"
      ),
      "@storybook/react-native": path.resolve(
        __dirname,
        "node_modules/@storybook/react-native"
      ),
      "@storybook/addon-links": path.resolve(
        __dirname,
        "node_modules/@storybook/addon-links"
      ),
      "@storybook/addon-actions": path.resolve(
        __dirname,
        "node_modules/@storybook/addon-actions"
      )
    }
  }
};
