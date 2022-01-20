/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const exclusionList = require("metro-config/src/defaults/exclusionList");
const defaultSourceExts = require("metro-config/src/defaults/defaults")
  .sourceExts;

const customSourceExts = [];

// We patch the React Native build script to set this environment to
// `variant.name` during the build process. The variant name in Gradle is of the
// format `flavorBuildtype` e.g. `qaRelease` - the flavor is in lowercase and
// the build type is capitalized. We use this to conditionally include files
// depending on the flavor, e.g. a file named `intro.qa.js` will only be
// included in the `qa` flavor of the app.
if (process.env.APP_VARIANT) {
  const match = process.env.APP_VARIANT.match(/^[^A-Z]*/);
  if (match) {
    const flavor = match[0].toLowerCase();
    for (const ext of defaultSourceExts) {
      customSourceExts.push(`${flavor}.${ext}`);
    }
  }
}

// Set RN_SRC_EXT to conditionally include files based on the file extension.
// E.g. set it to `e2e` to include the file `MyComponent.e2e.js` or
// `MyComponent.e2e.ts` instead of `MyComponent.js` or `MyComponent.ts`.
if (process.env.RN_SRC_EXT) {
  process.env.RN_SRC_EXT.split(",").forEach(ext => {
    // We previously included the file extension in this environment variable,
    // but with our shift to Typescript we need to also include `.ts` and `.tsx`
    const name = ext.replace(/\.js$/, "");
    if (!ext) return;
    for (const ext of defaultSourceExts) {
      customSourceExts.push(`${name}.${ext}`);
    }
  });
}

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        // This should be set to true but doing so potentially breaks async storage module
        //   - https://github.com/facebook/metro/issues/682
        //   - https://github.com/react-native-async-storage/async-storage/issues/604
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    blockList: exclusionList([/nodejs-assets\/.*/, /android\/.*/, /ios\/.*/]),
    sourceExts: customSourceExts.concat(defaultSourceExts),
  },
};
