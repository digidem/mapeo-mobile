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
  "expo-document-picker",
  "@unimodules",
  "@react-native-picker/picker",
];

module.exports = {
  preset: "react-native",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  testPathIgnorePatterns: ["/node_modules/", "/e2e/", "/src/backend/"],
  modulePathIgnorePatterns: [
    "/nodejs-assets/",
    // Because we compile the backend and include in the app, package.json and
    // others will be in the android and ios folders and cause Jest to complain
    "/android/",
    "/ios/",
  ],
  transformIgnorePatterns: [
    `/node_modules/(?!(${modulesToTransform.join("|")})/)`,
  ],
  setupFiles: ["<rootDir>/jest/setup.js"],
};
