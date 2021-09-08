import { NativeModules, Platform } from "react-native";

/**
 * @type {object}
 * @property {string} sourceDir Full path to the base APK for this application.
 */
const constants =
  Platform.OS === "android" ? NativeModules.AppInfo.getConstants() : {};

export default constants;
