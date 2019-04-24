module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
      loader: "url-loader",
      options: { name: "[name].[ext]" }
    }
  });

  config.resolve.extensions = [".web.js", ".js", ".json", ".web.jsx", ".jsx"];

  config.resolve.alias = {
    ...config.resolve.alias,
    "react-native": "react-native-web",
    "@storybook/react-native": "@storybook/react",
    "react-native-gesture-handler": "react-native-web",
    "react-native-vector-icons/Octicons":
      "react-native-vector-icons/dist/Octicons",
    "react-native-vector-icons/MaterialIcons":
      "react-native-vector-icons/dist/MaterialIcons",
    "react-native-vector-icons/FontAwesome":
      "react-native-vector-icons/dist/FontAwesome",
    "react-native-vector-icons/MaterialCommunityIcons":
      "react-native-vector-icons/dist/MaterialCommunityIcons"
  };

  return config;
};
