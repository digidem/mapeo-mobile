const modulesToTransform = [
  "react-native",
  "@react-native(-community)?",
  "react-native-splash-screen",
  "ky",
  "react-native-fs",
  "react-native-reanimated",
  "@react-navigation",
  "react-navigation",
  "react-native-gesture-handler",
  "react-native-iphone-x-helper",
  "react-navigation-stack",
  "react-native-vector-icons",
  "@react-native-mapbox-gl",
];

module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  testPathIgnorePatterns: ["/node_modules/", "/e2e/", "/src/backend/"],
  transformIgnorePatterns: [
    `/node_modules/(?!(${modulesToTransform.join("|")})/)`,
  ],
  setupFiles: ["<rootDir>/jest/setup.js"],
};
