import { NativeModules } from "react-native";

/**
 * @type {object}
 * @property {string} sourceDir Full path to the base APK for this application.
 * @property {string} minSdkVersion The minimum SDK version this application can run on. It will not run on earlier versions.
 */
const constants = NativeModules.AppInfo.getConstants();

export default constants;
