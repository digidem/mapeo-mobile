// @ts-check

import { Static } from "@sinclair/typebox";
import { InstallerExtSchema } from "./schema";
import {
  FastifyReply,
  FastifyRequest,
  RawServerDefault,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
} from "fastify";

// External installer type, in server responses
export type InstallerExt = Static<typeof InstallerExtSchema>;
// Internal installer type (for installers stored locally), with filepath instead of url
export type InstallerInt = Omit<InstallerExt, "url"> & {
  filepath: string;
};
export type Reply<RouteGeneric> = FastifyReply<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  RouteGeneric
>;
export type Request<RouteGeneric> = FastifyRequest<
  RouteGeneric,
  RawServerDefault,
  RawRequestDefaultExpression
>;
// An upload or a download in progress
export interface TransferProgress {
  /** id (hash) of the file being transferrer */
  id: string;
  /** bytes transferred so far */
  sofar: number;
  /** total number of bytes to transfer */
  total: number;
}
// Info about the current device
export interface DeviceInfo {
  supportedAbis: InstallerExt["arch"];
  sdkVersion: number;
}
export type AsyncServiceStateValue =
  | "stopped"
  | "starting"
  | "started"
  | "stopping"
  | "error";

export type AsyncServiceStateDefault =
  | {
      value: Exclude<AsyncServiceStateValue, "error">;
    }
  | {
      value: "error";
      error: Error;
    };
export type UpgradeState = AsyncServiceStateDefault & {
  uploads: TransferProgress[];
  downloads: TransferProgress[];
  availableUpgrade?: InstallerInt;
};
