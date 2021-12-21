import { Alert } from "react-native";
import { fromLatLon } from "utm";
import type { SelectOptions, LabeledSelectOption, Key } from "mapeo-schema";

import type { LocationContextType } from "../context/LocationContext";
import type {
  ObservationValue,
  ObservationAttachment,
} from "../context/ObservationsContext";
import type { SavedPhoto } from "../context/DraftObservationContext";
import type {
  Preset,
  PresetsMap,
  PresetWithFields,
  FieldsMap,
  State as Config,
} from "../context/ConfigContext";

export function getDisplayName(WrappedComponent: any) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

// If the current position on the app state is more than 60 seconds old then we
// consider it stale and show that the GPS is searching for a new position
const STALE_TIMEOUT = 60 * 1000; // 60 seconds
// If the precision is less than 10 meters then we consider this to be a "good
// position" and we change the UI accordingly
const GOOD_PRECISION = 10; // 10 meters

export type LocationStatus = "searching" | "improving" | "good" | "error";

// Little helper to timeout a promise
export function promiseTimeout<T>(
  promise: Promise<T>,
  ms: number,
  msg?: string
) {
  let timeoutId: number;
  const timeout: Promise<void> = new Promise((_resolve, reject) => {
    timeoutId = window.setTimeout(() => {
      reject(new Error(msg || "Timeout after " + ms + "ms"));
    }, ms);
  });
  promise.finally(() => window.clearTimeout(timeoutId));
  return Promise.race([promise, timeout]);
}

export function parseVersionMajor(versionString: string = "") {
  const major = Number.parseInt(versionString.split(".")[0]);
  return isNaN(major) ? 0 : major;
}

export function getLocationStatus({
  position,
  provider,
  permission,
  error,
}: LocationContextType): LocationStatus {
  const precision = position && position.coords.accuracy;
  const gpsUnavailable = provider && !provider.gpsAvailable;
  const locationServicesDisabled =
    provider && !provider.locationServicesEnabled;
  const noPermission = permission && permission !== "granted";
  const positionStale =
    position && Date.now() - position.timestamp > STALE_TIMEOUT;
  if (error || gpsUnavailable || locationServicesDisabled || noPermission)
    return "error";
  else if (positionStale) return "searching";
  else if (
    typeof precision === "number" &&
    Math.round(precision) <= GOOD_PRECISION
  )
    return "good";
  else if (typeof precision === "number") return "improving";
  return "searching";
}

// Get a matching preset from a Map of presets, for a given observation value
export function matchPreset(
  observationValue: ObservationValue,
  presets: PresetsMap
): Preset | void {
  const categoryId = (observationValue.tags as { categoryId?: string })
    .categoryId;
  if (!categoryId) return;
  return presets.get(categoryId);
}

export function addFieldDefinitions(
  preset: Preset,
  fields: FieldsMap
): PresetWithFields {
  const fieldDefs = Array.isArray(preset.fields)
    ? preset.fields.map(fieldId => fields.get(fieldId))
    : [];

  return {
    ...preset,
    fields: filterFalsy(fieldDefs),
  };
}

// Filter photos from an array of observation attachments (we could have videos
// and other media types)
export function filterPhotosFromAttachments(
  attachments: ObservationAttachment[] = []
): SavedPhoto[] {
  return attachments.reduce((acc, att) => {
    if (
      att.type === "image/jpeg" ||
      // This is needed for backwards compat, because early versions did not
      // save a type
      (att.type === undefined && /(\.jpg|\.jpeg)$/i.test(att.id))
    )
      acc.push({ id: att.id, type: att.type });
    return acc;
  }, [] as SavedPhoto[]);
}

// Coordinates conversions
function toDegreesMinutesAndSeconds(coordinate: number) {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = (minutesNotTruncated - minutes) * 60;
  return {
    degrees,
    minutes,
    seconds,
  };
}

export function convertDmsToDd({
  degrees,
  minutes,
  seconds,
}: {
  degrees: number;
  minutes: number;
  seconds: number;
}) {
  return degrees + minutes / 60 + seconds / 3600;
}

// Style from National Geographic style guide
// https://sites.google.com/a/ngs.org/ngs-style-manual/home/L/latitude-and-longitude
function convertToDMS({ lat, lon }: { lat: number; lon: number }) {
  const latitude = formatDms(toDegreesMinutesAndSeconds(lat));
  const latitudeCardinal = lat >= 0 ? "N" : "S";

  const longitude = formatDms(toDegreesMinutesAndSeconds(lon));
  const longitudeCardinal = lon >= 0 ? "E" : "W";
  return `${latitude} ${latitudeCardinal}, ${longitude} ${longitudeCardinal}`;
}

function convertToUTM({ lat, lon }: { lat: number; lon: number }) {
  try {
    const { easting, northing, zoneNum, zoneLetter } = fromLatLon(lat, lon);
    const formattedEasting = leftPad(easting.toFixed(), 6, "0");
    const formattedNorthing = leftPad(northing.toFixed(), 6, "0");
    return `UTM ${zoneNum}${zoneLetter} ${formattedEasting} ${formattedNorthing}`;
  } catch (e) {
    // Some coordinates (e.g. < 80S or 84N) cannot be formatted as UTM
    return `${lat >= 0 ? "+" : ""}${lat.toFixed(6)}°, ${
      lon >= 0 ? "+" : ""
    }${lon.toFixed(6)}°`;
  }
}

// Style from National Geographic style guide
// https://sites.google.com/a/ngs.org/ngs-style-manual/home/L/latitude-and-longitude
function formatDD({ lat, lon }: { lat: number; lon: number }) {
  const formattedLat = Math.abs(lat).toFixed(6);
  const formattedLon = Math.abs(lon).toFixed(6);
  const latCardinal = lat >= 0 ? "N" : "S";
  const lonCardinal = lon >= 0 ? "E" : "W";
  return `${formattedLat}° ${latCardinal}, ${formattedLon}° ${lonCardinal}`;
}

function formatDms({
  degrees,
  minutes,
  seconds,
}: {
  degrees: number;
  minutes: number;
  seconds: number;
}) {
  return `${degrees}° ${minutes}' ${seconds.toFixed(3)}"`;
}

export function formatCoords({
  lon,
  lat,
  format = "utm",
}: {
  lon: number;
  lat: number;
  format?: "utm" | "dd" | "dms";
}): string {
  switch (format) {
    case "dd":
      return formatDD({ lat, lon });
    case "utm":
      return convertToUTM({ lat, lon });
    case "dms":
      return convertToDMS({ lat, lon });
    default:
      return convertToUTM({ lat, lon });
  }
}

export function getProp(tags: any, fieldKey: Key, defaultValue: any) {
  // TODO: support deeply nested tags.
  const shallowKey = Array.isArray(fieldKey) ? fieldKey[0] : fieldKey;
  const tagValue = tags[shallowKey];
  return typeof tagValue === "undefined" ? defaultValue : tagValue;
}

/**
 * Convert a select option which could either be a string or an object with
 * label and value props, to an object with label and value props TODO: Show
 * meaningful translated values for null and boolean, but these types are not
 * used widely in presets yet
 */
export function convertSelectOptionsToLabeled(
  options: SelectOptions // TODO: Need to update after updating `mapeo-schema` definitions
): LabeledSelectOption[] {
  return options.map((option: unknown) => {
    if (option === null) {
      return { label: "NULL", value: option };
    } else if (typeof option === "boolean") {
      return { label: option ? "TRUE" : "FALSE", value: option };
    } else if (typeof option === "string" || typeof option === "number") {
      return { label: option + "", value: option };
    } else {
      return option;
    }
  });
}

function leftPad(str: string, len: number, char: string): string {
  // doesn't need to pad
  len = len - str.length;
  if (len <= 0) return str;

  var pad = "";
  while (true) {
    if (len & 1) pad += char;
    len >>= 1;
    if (len) char += char;
    else break;
  }
  return pad + str;
}

// https://stackoverflow.com/a/58110124
type Truthy<T> = T extends false | "" | 0 | null | undefined ? never : T; // from lodash
function truthy<T>(value: T): value is Truthy<T> {
  return !!value;
}

// This is a helper function to force the type definition
// It filters an array to remove any falsy values
function filterFalsy<T>(arr: T[]) {
  return arr.filter(truthy);
}

export function showWipAlert() {
  Alert.alert("Work in progress", "This feature has not been implemented yet", [
    {
      text: "Ok",
      onPress: () => {},
    },
  ]);
}

export function isInPracticeMode(config: Config) {
  // TODO change how we determine whether we are in practice mode or not
  return config.metadata.name === "mapeo-default-settings";
}
