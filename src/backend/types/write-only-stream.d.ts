// Type definitions for dns-discovery 6.2.3
// Project: https://github.com/mafintosh/dns-discovery
// TypeScript Version: 4.2

/// <reference types="node" />

declare module "write-only-stream" {
  import { Stream, Writable } from "stream";
  function writeonly(stream: Stream): Writable;
  export = writeonly;
}
