// @flow
import "core-js/es/reflect";
import { PixelRatio, PermissionsAndroid } from "react-native";
import ky from "ky";
import nodejs from "nodejs-mobile-react-native";
import RNFS from "react-native-fs";
import debug from "debug";

import type { Preset, Field } from "./context/PresetsContext";
import type {
  Observation,
  ObservationValue
} from "./context/ObservationsContext";
import { promiseTimeout } from "./lib/utils";
import STATUS from "./../backend/constants";

import type { IconSize, ImageSize } from "./types";
import type { Photo } from "./context/DraftObservationContext";
import type { Observation as ServerObservation } from "mapeo-schema";

export type ServerStatus = $Keys<typeof STATUS>;
export type Subscription = { remove: () => any };

export type ServerPeer = {
  id: string,
  name: string,
  // Host address for peer
  host: string,
  // Port for peer
  port: number,
  state?:
    | {|
        topic: "replication-progress",
        message: {|
          db: {| sofar: number, total: number |},
          media: {| sofar: number, total: number |}
        |},
        lastCompletedDate?: number
      |}
    | {|
        topic: "replication-wifi-ready",
        lastCompletedDate?: number
      |}
    | {|
        topic: "replication-complete",
        // The time of completed sync in milliseconds since UNIX Epoch
        message: number,
        lastCompletedDate?: number
      |}
    | {|
        topic: "replication-error",
        // Error message
        message: string,
        lastCompletedDate?: number
      |}
    | {|
        topic: "replication-started",
        lastCompletedDate?: number
      |}
};

type PeerHandler = (peerList: Array<ServerPeer>) => any;

export { STATUS as Constants };

const log = debug("mapeo-mobile:api");
const BASE_URL = "http://127.0.0.1:9081/";
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const SERVER_START_TIMEOUT = 10000;

const pixelRatio = PixelRatio.get();

export function Api({
  baseUrl,
  timeout = DEFAULT_TIMEOUT
}: {
  baseUrl: string,
  timeout?: number
}) {
  let status: ServerStatus = STATUS.STARTING;
  let timeoutId: TimeoutID;

  const req = ky.extend({
    prefixUrl: baseUrl,
    // No timeout because indexing after first sync takes a long time, which mean
    // requests to the server take a long time
    timeout: false,
    headers: {
      "cache-control": "no-cache",
      pragma: "no-cache"
    }
  });

  const pending: Array<{ resolve: () => any, reject: Error => any }> = [];
  let listeners: Array<(status: ServerStatus) => any> = [];

  nodejs.channel.addListener("status", onStatusChange);

  function onStatusChange(newStatus: ServerStatus) {
    status = newStatus;
    if (status === STATUS.LISTENING) {
      while (pending.length) pending.shift().resolve();
    } else if (status === STATUS.ERROR) {
      while (pending.length) pending.shift().reject(new Error("Server Error"));
    } else if (status === STATUS.TIMEOUT) {
      while (pending.length)
        pending.shift().reject(new Error("Server Timeout"));
    }
    listeners.forEach(handler => handler(status));
    if (status === STATUS.LISTENING || status === STATUS.STARTING) {
      restartTimeout();
    } else {
      clearTimeout(timeoutId);
    }
  }

  function restartTimeout() {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => onStatusChange(STATUS.TIMEOUT), timeout);
  }

  // Returns a promise that resolves when the server is ready to accept a
  // request and rejects if there is an error with server startup
  function onReady() {
    return new Promise((resolve, reject) => {
      log("onReady called", status);
      if (status === STATUS.LISTENING) resolve();
      else if (status === STATUS.ERROR) reject(new Error("Server Error"));
      else if (status === STATUS.TIMEOUT) reject(new Error("Server Timeout"));
      else pending.push({ resolve, reject });
    });
  }

  // Request convenience methods that wait for the server to be ready
  function get(url: string) {
    return onReady().then(() => req.get(url).json());
  }
  function put(url: string, data: any) {
    return onReady().then(() => req.put(url, { json: data }).json());
  }
  function post(url: string, data: any) {
    return onReady().then(() => req.post(url, { json: data }).json());
  }

  // All public methods
  const api = {
    // Start server, returns a promise that resolves when the server is ready
    // or rejects if there is an error starting the server
    startServer: function startServer(): Promise<void> {
      // The server requires read & write permissions for external storage
      const serverStartPromise = PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ])
        .then(results => {
          const permissionsGranted = Object.values(results).every(
            r => r === PermissionsAndroid.RESULTS.GRANTED
          );
          if (!permissionsGranted)
            throw new Error("Storage read and write permissions not granted");
          log("REQUESTING NODE START");
          nodejs.start("loader.js");
          // We know the node process has started as soon as we hear a status
          return new Promise(resolve => nodejs.channel.once("status", resolve));
        })
        .then(() => {
          log("FIRST HEARTBEAT FROM NODE");
          // Start monitoring for timeout
          restartTimeout();
          // As soon as we hear from the Node process, send the storagePath so
          // that the server can start
          nodejs.channel.post("storagePath", RNFS.ExternalDirectoryPath);
          // Resolve once the server reports status as "LISTENING"
          return onReady();
        });
      return promiseTimeout(
        serverStartPromise,
        SERVER_START_TIMEOUT,
        "Server start timeout"
      );
    },

    addServerStateListener: function addServerStateListener(
      handler: (status: ServerStatus) => any
    ): Subscription {
      listeners.push(handler);
      return {
        remove: () => (listeners = listeners.filter(h => h !== handler))
      };
    },

    /**
     * GET async methods
     */

    getPresets: function getPresets(): Promise<Preset[]> {
      return get("presets/default/presets.json").then(data =>
        mapToArray(data.presets)
      );
    },

    getFields: function getFields(): Promise<Field[]> {
      return get("presets/default/presets.json").then(data =>
        mapToArray(data.fields)
      );
    },

    getObservations: function getObservations(): Promise<Observation[]> {
      return get("observations").then(data => data.map(convertFromServer));
    },

    getMapStyle: function getMapStyle(id: string): Promise<any> {
      return get(`styles/${id}/style.json`);
    },

    /**
     * PUT and POST methods
     */

    savePhoto: function savePhoto({
      originalUri,
      previewUri,
      thumbnailUri
    }: Photo): Promise<{| id: string |}> {
      if (!originalUri || !previewUri || !thumbnailUri)
        return Promise.reject(
          new Error("Missing uri for full image or thumbnail to save to server")
        );
      const data = {
        original: originalUri.replace(/^file:\/\//, ""),
        preview: previewUri.replace(/^file:\/\//, ""),
        thumbnail: thumbnailUri.replace(/^file:\/\//, "")
      };
      const createPromise = post("media", data);
      // After images have saved to the server we can delete the versions in
      // local cache to avoid filling up space on the phone
      const localFiles = Object.values(data);
      createPromise
        // $FlowFixMe - Flow has issues with Object.values
        .then(_ => Promise.all(localFiles.map(path => RNFS.unlink(path))))
        .then(() => log("Deleted temp photos on save", localFiles))
        .catch(err => log("Error deleting local image file", err));
      return createPromise;
    },

    updateObservation: function updateObservation(
      id: string,
      value: ObservationValue,
      options: {|
        links: Array<string>,
        userId?: $ElementType<ServerObservation, "userId">
      |}
    ): Promise<Observation> {
      const valueForServer = {
        ...value,
        // work around for a quirk in the api right now, we should probably change
        // this to accept a links array. An array is needed if you want to merge
        // existing forks
        version: options.links[0],
        userId: options.userId,
        type: "observation",
        schemaVersion: 3,
        id
      };
      return put(`observations/${id}`, valueForServer).then(
        (serverObservation: ServerObservation) =>
          convertFromServer(serverObservation)
      );
    },

    createObservation: function createObservation(
      value: ObservationValue
    ): Promise<Observation> {
      const valueForServer = {
        ...value,
        type: "observation",
        schemaVersion: 3
      };
      return post("observations", valueForServer).then(
        (serverObservation: ServerObservation) =>
          convertFromServer(serverObservation)
      );
    },

    /**
     * SYNC methods
     */

    // Listens to the server for updates to the list of peers available for sync
    // returns a remove() function to unscubribe
    addPeerListener: function addPeerListener(
      handler: PeerHandler
    ): Subscription {
      // We sidestep the http API here, and instead of polling the endpoint, we
      // listen for an event from mapeo-core whenever the peers change, then
      // request an updated peer list.
      nodejs.channel.addListener("peer-update", handler);
      api.syncGetPeers().then(handler);
      return {
        remove: () => nodejs.channel.removeListener("peer-update", handler)
      };
    },

    // Start listening for sync peers and advertise with `deviceName`
    syncJoin: function syncJoin(deviceName: string) {
      req.get(`sync/join?name=${deviceName}`);
    },

    // Stop listening for sync peers and stop advertising
    syncLeave: function syncLeave() {
      req.get("sync/leave");
    },

    // Get a list of discovered sync peers
    syncGetPeers: function syncGetPeers() {
      return get("sync/peers").then(data => data && data.message);
    },

    // Start sync with a peer
    syncStart: function syncStart(target: { host: string, port: number }) {
      return onReady().then(() => nodejs.channel.post("sync-start", target));
    },

    /**
     * HELPER synchronous methods
     */

    // Return the url for an icon
    getIconUrl: function getIconUrl(
      iconId: string,
      size: IconSize = "medium"
    ): string {
      // Some devices are @4x or above, but we only generate icons up to @3x
      // Also we don't have @1.5x, so we round it up
      const roundedRatio = Math.min(Math.ceil(pixelRatio), 3);
      return `${BASE_URL}presets/default/icons/${iconId}-medium@${roundedRatio}x.png`;
    },

    // Return the url for a media attachment
    getMediaUrl: function getMediaUrl(
      attachmentId: string,
      size: ImageSize
    ): string {
      return `${BASE_URL}media/${size}/${attachmentId}`;
    },

    // Return the File Uri for a media attachment in local storage. Necessary
    // for sharing media with other apps.
    // **WARNING**: This depends on internal implementation of the media blob
    // store and will break if that changes. I apologise if you reach here after
    // some lengthy debugging.
    getMediaFileUri: function getMediaFileUri(
      attachmentId: string,
      size: ImageSize
    ): string {
      const dir = RNFS.DocumentDirectoryPath;
      return `file://${dir}/media/${size}/${attachmentId.slice(
        0,
        2
      )}/${attachmentId}`;
    },

    // Return the url to a map style
    getMapStyleUrl: function getMapStyleUrl(id: string): string {
      return `${BASE_URL}styles/${id}/style.json`;
    }
  };

  return api;
}

export default Api({ baseUrl: BASE_URL });

function mapToArray<T>(map: { [string]: T }): Array<T> {
  return Object.keys(map).map(id => ({
    ...map[id],
    id: id
  }));
}

function convertFromServer(obs: ServerObservation): Observation {
  const {
    id,
    version,
    type,
    created_at,
    timestamp,
    userId,
    links,
    schemaVersion,
    ...value
  } = obs;
  return {
    id,
    version,
    type,
    created_at,
    timestamp,
    userId,
    links,
    schemaVersion,
    value: {
      ...value,
      tags: (value || {}).tags
    }
  };
}
