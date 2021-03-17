// @flow
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
): Promise<T> {
  let timeoutId: TimeoutID;
  const timeout = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(msg || "Timeout after " + ms + "ms"));
    }, ms);
  });
  promise.finally(() => clearTimeout(timeoutId));
  return Promise.race([promise, timeout]);
}

export function parseVersionMajor(versionString?: string = "") {
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
  const categoryId = observationValue.tags.categoryId;
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
  // $FlowFixMe - Need to figure out how to convert types like this
  return {
    ...preset,
    fields: filterFalsy(fieldDefs),
  };
}

// Filter photos from an array of observation attachments (we could have videos
// and other media types)
export function filterPhotosFromAttachments(
  attachments?: Array<ObservationAttachment> = []
): Array<SavedPhoto> {
  return attachments.reduce((acc, att) => {
    if (
      att.type === "image/jpeg" ||
      // This is needed for backwards compat, because early versions did not
      // save a type
      (att.type === undefined && /(\.jpg|\.jpeg)$/i.test(att.id))
    )
      acc.push({ id: att.id, type: att.type });
    return acc;
  }, []);
}

export function getLastPhotoAttachment(
  attachments?: Array<ObservationAttachment> = []
): SavedPhoto | void {
  return filterPhotosFromAttachments(attachments).pop();
}

// Coordinates conversions
function toDegreesMinutesAndSeconds(coordinate) {
  var absolute = Math.abs(coordinate);
  var degrees = Math.floor(absolute);
  var minutesNotTruncated = (absolute - degrees) * 60;
  var minutes = Math.floor(minutesNotTruncated);
  var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

  return `${degrees} ${minutes} ${seconds}`;
}

function convertToDMS(lat, lon) {
  var latitude = toDegreesMinutesAndSeconds(lat);
  var latitudeCardinal = lat >= 0 ? "N" : "S";

  var longitude = toDegreesMinutesAndSeconds(lon);
  var longitudeCardinal = lon >= 0 ? "E" : "W";
  return `${latitude} ${latitudeCardinal} ${longitude} ${longitudeCardinal}`;
}

function convertToUTM(lat, lon) {
  try {
    let { easting, northing, zoneNum, zoneLetter } = fromLatLon(lat, lon);
    easting = leftPad(easting.toFixed(), 6, "0");
    northing = leftPad(northing.toFixed(), 6, "0");
    return `UTM ${zoneNum}${zoneLetter} ${easting} ${northing}`;
  } catch (e) {
    // Some coordinates (e.g. < 80S or 84N) cannot be formatted as UTM
    return `${lat >= 0 ? "+" : ""}${lat.toFixed(6)}°, ${
      lon >= 0 ? "+" : ""
    }${lon.toFixed(6)}°`;
  }
}

function convertDMSToDD(degrees, minutes, seconds, direction) {
  let dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);
  if (direction === "S" || direction === "W") {
    dd = dd * -1;
  } // Don't do anything for N or E
  return dd;
}

function convertToDD(lat, lon) {
  const [latD, latM, latS, latDi, lonD, lonM, lonS, lonDi] = convertToDMS(
    lat,
    lon
  ).split(" ");
  const latDD = convertDMSToDD(latD, latM, latS, latDi);
  const lonDD = convertDMSToDD(lonD, lonM, lonS, lonDi);
  return `${latDD} ${lonDD}`;
}

export function formatCoords({
  lon,
  lat,
  format = "utm",
}: {
  lon: number,
  lat: number,
  format?: "utm",
}): string {
  switch (format) {
    case "latlon":
      return `${lat} ${lon}`;
    case "utm":
      return convertToUTM(lat, lon);
    case "dms":
      return convertToDMS(lat, lon);
    case "dd":
      return convertToDD(lat, lon);
    default:
      return convertToUTM(lat, lon);
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
  options: SelectOptions
): LabeledSelectOption[] {
  return options.map(option => {
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

// This is a helper function to force the type definition
// It filters an array to remove any falsy values
function filterFalsy<T>(arr: Array<T | void>): Array<T> {
  return arr.filter(Boolean);
}
