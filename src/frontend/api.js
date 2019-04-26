// @flow
import "core-js/es6/reflect";
import { PixelRatio } from "react-native";
import ky from "ky";

import type { Preset, Field } from "./context/PresetsContext";
import type {
  Observation,
  ObservationValue
} from "./context/ObservationsContext";
import type { IconSize, ImageSize } from "./types";
import type { Photo } from "./context/DraftObservationContext";
import type { Observation as ServerObservation } from "mapeo-schema";

const BASE_URL = "http://127.0.0.1:9080/";
const api = ky.extend({
  prefixUrl: BASE_URL,
  headers: {
    "cache-control": "no-cache",
    pragma: "no-cache"
  }
});
const pixelRatio = PixelRatio.get();

export function getPresets(): Promise<Preset[]> {
  return api
    .get("presets/default/presets.json")
    .json()
    .then(data => mapToArray(data.presets));
}

export function getFields(): Promise<Field[]> {
  return api
    .get("presets/default/presets.json")
    .json()
    .then(data => mapToArray(data.fields));
}

export function getObservations(): Promise<Observation[]> {
  return api
    .get("observations")
    .json()
    .then(data => data.map(convertFromServer));
}

export function getIconUrl(iconId: string, size: IconSize = "medium"): string {
  const roundedRatio = Math.floor(pixelRatio);
  return `${BASE_URL}presets/default/icons/${iconId}-medium@${roundedRatio}x.png`;
}

export function getMediaUrl(attachmentId: string, size: ImageSize): string {
  return `${BASE_URL}media/${size}/${attachmentId}`;
}

export function savePhoto({
  fullUri,
  thumbnailUri
}: Photo): Promise<{| id: string |}> {
  if (!fullUri || !thumbnailUri)
    return Promise.reject(
      new Error("Missing uri for full image or thumbnail to save to server")
    );
  fullUri = fullUri.replace(/^file:\/\//, "");
  thumbnailUri = thumbnailUri.replace(/^file:\/\//, "");
  const url = `media?file=${fullUri}&thumbnail=${thumbnailUri}`;
  return api.put(url).json();
}

export function updateObservation(
  id: string,
  value: ObservationValue
): Promise<Observation> {
  return api.put(`observations/${id}`, { json: value }).json();
}

export function createObservation(
  value: ObservationValue
): Promise<Observation> {
  const valueForServer = {
    ...value,
    type: "observation"
  };
  return api
    .post("observations", { json: valueForServer })
    .json()
    .then(serverObservation => convertFromServer(serverObservation));
}

function mapToArray<T>(map: { [string]: T }): Array<T> {
  return Object.keys(map).map(id => ({
    ...map[id],
    id: id
  }));
}

// function convertToServer(obs: Observation): ServerObservation {
//   const { value, ...other } = obs;
//   return {
//     ...other,
//     ...value
//   };
// }

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
