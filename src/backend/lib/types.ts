import { TypedEmitter } from "tiny-typed-emitter";
import {
  ManagerEvents,
  UpgradeState,
  DeviceInfo,
} from "../upgrade-manager/types";

interface SyncTarget {
  host: string;
  port: number;
}

type PeerError =
  | {
      topic: "replication-error";
      message: string;
      lastCompletedDate?: number;
    }
  | {
      topic: "replication-error";
      message: string;
      code: "ERR_VERSION_MISMATCH";
      usVersion: string;
      themVersion: string;
    }
  | {
      topic: "replication-error";
      message: string;
      code: "ERR_CLIENT_MISMATCH";
      usClient: string;
      themClient: string;
    };

export interface Peer {
  id: string;
  name: string;
  // Host address for peer
  host: string;
  // Port for peer
  port: number;
  // Whether device is desktop or mobile
  deviceType: "desktop" | "mobile";
  connected: boolean;
  state?:
    | {
        topic: "replication-progress";
        message: {
          db: { sofar: number; total: number };
          media: { sofar: number; total: number };
        };
        lastCompletedDate?: number;
      }
    | {
        topic: "replication-wifi-ready";
        lastCompletedDate?: number;
      }
    | {
        topic: "replication-complete";
        // The time of completed sync in milliseconds since UNIX Epoch
        message: number;
        lastCompletedDate?: number;
      }
    | PeerError
    | {
        topic: "replication-started";
        lastCompletedDate?: number;
      };
}

interface PracticeModeInfo {
  id?: undefined;
  key?: undefined;
  name?: string;
  practiceMode: true;
}

interface JoinedProjectInfo {
  id: string;
  key: string;
  name?: string;
  practiceMode: false;
}

export type ProjectInfo = PracticeModeInfo | JoinedProjectInfo;

export interface SyncApiEvents {
  peers: (peers: Peer[]) => void;
  error: (error: Error) => void;
}

interface SyncApi extends TypedEmitter<SyncApiEvents> {
  joinSwarm(opts?: { deviceName?: string }): void;
  leaveSwarm(): void;
  startSync(target: SyncTarget): void;
  getPeers(): Peer[];
}

interface UpgradeApi extends TypedEmitter<ManagerEvents> {
  start(): Promise<void>;
  stop(): Promise<void>;
  getState(): UpgradeState;
}

interface ProjectApi {
  getInfo(): Omit<ProjectInfo, "key">;
  replaceConfig(fileUri: string): Promise<Omit<ProjectInfo, "key">>;
  // create(
  //   projectInfo: Omit<JoinedProjectInfo, "key" | "id">
  // ): Omit<JoinedProjectInfo, "key">;
  // join(): Omit<JoinedProjectInfo, "key">;
  // leave(): Promise<void>;
}

export interface Api {
  sync: SyncApi;
  upgrade: UpgradeApi;
  project: ProjectApi;
}

export type AsyncServiceStateValue =
  | "stopped"
  | "starting"
  | "started"
  | "stopping"
  | "error";

export type BackendStateValue = AsyncServiceStateValue | "idle";

export type AsyncServiceState =
  | {
      value: Exclude<AsyncServiceStateValue, "error">;
    }
  | {
      value: "error";
      error: Error;
    };

/**
 * Configuration passed from the frontend to the backend, because this
 * information is only available in the React Native thread, not NodeJS
 */
export interface BackendConfig {
  /** File path to the shared storage folder */
  sharedStorage: string;
  /** File path to the private cache storage data (for non-persistent data) */
  privateCacheStorage: string;
  /** Information about the current device */
  deviceInfo: DeviceInfo;
  /** File path to APK for currently running app */
  apkFilepath: string;
  /** Set `true` to enable debug logging */
  debug: boolean;
}
