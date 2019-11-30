module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "react-native-fs": "./__mocks__/react-native-fs.js",
            "bugsnag-react-native": "./__mocks__/bugsnag-react-native.js",
            "@react-native-community/async-storage":
              "./__mocks__/async-storage.js",
            "mapeo-mobile-stories": "../src/stories",
            "react-native-vector-icons": "./node_modules/@expo/vector-icons"
          }
        }
      ],
      ["@babel/plugin-proposal-decorators", { legacy: true }]
    ]
  };
};
