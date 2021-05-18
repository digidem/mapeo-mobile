// Type definitions for dns-discovery 6.2.3
// Project: https://github.com/mafintosh/dns-discovery
// TypeScript Version: 4.2

/// <reference types="node" />

declare module "dns-discovery" {
  import { TypedEmitter } from "tiny-typed-emitter";

  interface AnnounceOptions {
    publicPort?: number;
    impliedPort?: number;
  }
  interface DiscoveryOptions {
    server?: string | string[]; // put a centralized dns discovery server here
    ttl?: number; // ttl for records in seconds. defaults to Infinity.
    limit?: number; // max number of records stored. defaults to 10000.
    multicast?: boolean; // use multicast-dns. defaults to true.
    domain?: string; // top-level domain to use for records. defaults to dns-discovery.local
    socket?: NodeJS.Socket; // use this udp socket as the client socket
    loopback?: boolean; // discover yourself over multicast
  }

  interface DiscoveryConstructor {
    (options?: DiscoveryOptions): Discovery;
    new (options?: DiscoveryOptions): Discovery;
  }

  var discovery: DiscoveryConstructor;

  interface DiscoveryEvents {
    listening(): void;
    closed(): void;
    peer(name: string, peer: { host: string; port: number }): void;
    announced(name: string, options: { port: number }): void;
    unannounced(name: string, options: { port: number }): void;
    traffic(type: string, details: any): void;
    "secrets-rotated"(): void;
    error(error: Error): void;
  }

  interface Discovery extends TypedEmitter<DiscoveryEvents> {
    lookup(name: string, callback?: (error: Error) => void): void;
    announce(name: string, port: number): void;
    announce(name: string, port: number, options: AnnounceOptions): void;
    announce(
      name: string,
      port: number,
      callback: (error: Error) => void
    ): void;
    announce(
      name: string,
      port: number,
      options: AnnounceOptions,
      callback: (error: Error) => void
    ): void;
    unannounce(name: string, port: number): void;
    unannounce(name: string, port: number, options: AnnounceOptions): void;
    unannounce(
      name: string,
      port: number,
      callback: (error: Error) => void
    ): void;
    unannounce(
      name: string,
      port: number,
      options: AnnounceOptions,
      callback: (error: Error) => void
    ): void;
    listen(): void;
    listen(port: number): void;
    listen(callback: (error: Error) => void): void;
    listen(port: number, callback: (error: Error) => void): void;
    destroy(callback?: (error: Error) => void): void;
  }

  export = discovery;
}
