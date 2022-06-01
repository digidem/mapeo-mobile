export interface ServerStartupConfig {
  sharedStorage: string;
  privateCacheStorage: string;
  apkFilepath: string;
  sdkVersion: number;
  supportedAbis: Array<"x86" | "x86_64" | "armeabi-v7a" | "arm64-v8a">;
  version: string;
  buildNumber: string;
  bundleId: string;
  isDev: boolean;
}
