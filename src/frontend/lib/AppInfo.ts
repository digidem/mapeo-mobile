import { NativeModules } from "react-native";

interface AppInfo {
  sourceDir: string; // Full path to the base APK for this application.
}

const constants: AppInfo = NativeModules.AppInfo.getConstants();

export default constants;
