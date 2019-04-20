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
    "@storybook/react-native": "@storybook/react"
  };

  return config;
};
