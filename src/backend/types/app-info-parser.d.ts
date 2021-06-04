// Type definitions for app-info-parser 1.1.0
// Project: https://github.com/chenquincy/app-info-parser
// TypeScript Version: 4.2

/// <reference types="node" />

declare module "app-info-parser/src/apk" {
  class ApkParser {
    constructor(file: string);
    parse(): Promise<{
      versionCode: number;
      versionName: string;
      package: string;
      usesSdk?: {
        minSdkVersion?: number;
        targetSdkVersion?: number;
      };
      icon: null | string;
      // Contains many other fields, but we don't need them and too much to
      // figure out which ones are optional
    }>;
  }

  export = ApkParser;
}
