export interface ServerStartupConfig {
  sharedStorage: string;
  privateCacheStorage: string;
  apkFilepath: string;
  sdkVersion: number;
  supportedAbis: string[];
  version: string;
  buildNumber: string;
  bundleId: string;
  isDev: boolean;
}
