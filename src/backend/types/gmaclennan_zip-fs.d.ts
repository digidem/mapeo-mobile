// Type definitions for @gmaclennan/zip-fs 1.2.0
// Project: https://github.com/gmaclennan/zip-fs
// TypeScript Version: 4.2

/// <reference types="node" />

declare module "@gmaclennan/zip-fs" {
  class ZipFs {
    constructor(file: string);
    readdir(filepath: string, cb: (files: string[]) => void): void;
    close(cb: () => void): void;
  }

  export = ZipFs;
}
