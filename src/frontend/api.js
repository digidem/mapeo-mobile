// @flow
import "core-js/stable/reflect";
import { PixelRatio } from "react-native";
// import ky from "ky";

import observationsFixture from "./test_observations.json";
import presetsFixture from "./test_presets.json";
import type { Preset, Field } from "./context/PresetsContext";
import type { Observation } from "./context/ObservationsContext";
import type { IconSize, ImageSize } from "./types/other";

const BASE_URL = "http://127.0.0.1:9080/";
const pixelRatio = PixelRatio.get();

type GetPresetsCallback = (error: Error | null, data: Preset[]) => void;

export function getPresets(cb: GetPresetsCallback): void {
  const presets: Preset[] = mapToArray(presetsFixture.presets);
  setTimeout(() => {
    cb(null, presets);
  }, 1000);
  // const url = BASE_URL + "presets/";
  // ky(url, { retry: 0 })
  //   .json()
  //   .then(data => cb(null, data))
  //   .catch(cb);
}

type GetFieldsCallback = (error: Error | null, data: Field[]) => void;

export function getFields(cb: GetFieldsCallback): void {
  const fields: Field[] = mapToArray(presetsFixture.fields);
  setTimeout(() => {
    cb(null, fields);
  }, 1000);
}

type GetObservationsCallback = (
  error: Error | null,
  data: Observation[]
) => void;

export function getObservations(cb: GetObservationsCallback): void {
  setTimeout(() => cb(null, observationsFixture), 1000);
}

export function getIconUrl(iconId: string, size: IconSize): string {
  const roundedRatio = Math.floor(pixelRatio);
  return `${BASE_URL}icons/${iconId}_${size}@${roundedRatio}x.png`;
}

export function getMediaUrl(attachmentId: string, size: ImageSize): string {
  return `${BASE_URL}media/${size}/${attachmentId}`;
}

function mapToArray<T>(map: { [string]: T }): Array<T> {
  return Object.keys(map).map(id => ({
    ...map[id],
    id: id
  }));
}
