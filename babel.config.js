module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    // Allows simpler defineMessages with react-intl
    // https://github.com/akameco/babel-plugin-react-intl-auto
    ["react-intl-auto", { filebase: true, removePrefix: "src.frontend" }]
  ]
};
