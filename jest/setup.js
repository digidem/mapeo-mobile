/* eslint-env jest/globals */
import mockRNDeviceInfo from "react-native-device-info/jest/react-native-device-info-mock";
import "react-native-gesture-handler/jestSetup";

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");

  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};

  return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");

// As of react-native@0.64.X file has moved
// jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("react-native-device-info", () => mockRNDeviceInfo);
jest.mock("../src/frontend/lib/AppInfo.ts");
jest.mock("@bugsnag/react-native");
jest.mock("ky");
