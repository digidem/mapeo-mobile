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
import { PartialDeep } from "type-fest";
import UpgradeManager from ".";
import { AsyncServiceState } from "../lib/types";

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
/** Info about the current device */
export interface DeviceInfo {
  /** Which architectures the current device supports (e.g. a 64-bit Android
   * devices supports both armeabi-v71 and arm64-v8a) */
  supportedAbis: InstallerExt["arch"];
  /** Android only: The SDK version of the device */
  sdkVersion: number;
}

export type UpgradeStateInternal = {
  error?: Error;
  uploads: TransferProgress[];
  availableUpgrade?: InstallerInt;
};

export type UpgradeState = AsyncServiceState &
  UpgradeStateInternal & {
    downloads: TransferProgress[];
    checkedPeers: string[];
  };

interface ManagerEvents {
  state: (state: UpgradeState) => void;
  error: (error?: Error) => void;
}

interface ManagerOptions {
  currentApk: string;
  apkFiles?: string[];
  deviceInfo: DeviceInfo;
}

type TestUpgradeState =
  | UpgradeState
  | (UpgradeState & {
      availableUpgrade?: string;
    });

export interface ScenarioStepEvent {
  /** Message passed to t.pass() */
  message?: string;
  /** Name of event to listen for */
  eventName: "state";
  /** Expected value from event, will wait until timeout for this value */
  waitFor:
    | PartialDeep<TestUpgradeState>
    | ((value: TestUpgradeState) => boolean);
  /** Time in milliseconds to wait for `waitFor` */
  timeout?: number;
  /** Whilst waiting for `waitFor`, we should never match this */
  never?:
    | PartialDeep<TestUpgradeState>
    | ((value: TestUpgradeState) => boolean);
  /** Whilst waiting for `waitFor`, we should always match this */
  always?:
    | PartialDeep<TestUpgradeState>
    | ((value: TestUpgradeState) => boolean);
}

interface ScenarioStepFunction {
  (manager: UpgradeManager): Promise<void>;
}

type ScenarioStep = ScenarioStepEvent | ScenarioStepFunction;

export interface DevicePlan {
  label: string;
  config: ManagerOptions & { autoStart?: boolean };
  steps: Array<ScenarioStep>;
}
