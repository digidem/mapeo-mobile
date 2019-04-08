// @flow
import "core-js/stable/reflect";
import { PixelRatio } from "react-native";
import ky from "ky";

import observationsFixture from "./test_observations.json";
import presetsFixture from "./test_presets.json";
import type { Preset, Field } from "./context/PresetsContext";
import type { Observation } from "./context/ObservationsContext";
import type { IconSize, ImageSize } from "./types/other";

const BASE_URL = "http://127.0.0.1:9080/";
const pixelRatio = PixelRatio.get();

type GetPresetsCallback = (
  error: Error | null,
  data: {
    presets: { [string]: Preset },
    fields: { [string]: Field }
  }
) => void;

export function getPresets(cb: GetPresetsCallback): void {
  setTimeout(() => {
    cb(null, presetsFixture);
  }, 1000);
  // const url = BASE_URL + "presets/";
  // ky(url, { retry: 0 })
  //   .json()
  //   .then(data => cb(null, data))
  //   .catch(cb);
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
