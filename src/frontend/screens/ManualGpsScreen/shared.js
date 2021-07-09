// @flow
import { StyleSheet } from "react-native";
import type { LocationContextType } from "../../context/LocationContext";
import { BLACK, LIGHT_GREY } from "../../lib/styles";

export type FormProps = {|
  location: LocationContextType,
  onValueUpdate: (convertedCoordinates: {|
    error?: Error,
    coords?: {| lat?: number | null, lon?: number | null |},
  |}) => void,
|};

// https://stackoverflow.com/a/39399503
export const POSITIVE_DECIMAL_REGEX = /^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/;

export const INTEGER_REGEX = /^[0-9]\d*$/;

export function parseNumber(str: string): number | void {
  const num = Number.parseFloat(str);
  return isNaN(num) ? undefined : num;
}

export function getInitialCardinality(
  field: "lat" | "lon",
  location: LocationContextType
) {
  if (field === "lat") {
    if (!location.savedPosition) return "N";

    const { latitude } = location.savedPosition.coords;
    return latitude >= 0 ? "N" : "S";
  } else {
    if (!location.savedPosition) return "E";

    const { longitude } = location.savedPosition.coords;
    return longitude >= 0 ? "E" : "W";
  }
}
