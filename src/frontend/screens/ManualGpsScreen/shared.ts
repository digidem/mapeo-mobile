import type { LocationContextType } from "../../context/LocationContext";

export type CoordinateField = "lat" | "lon";

export type ConvertedCoordinateData = {
  error?: Error;
  coords?: { lat?: number | null; lon?: number | null };
};

export type FormProps = {
  location: LocationContextType;
  onValueUpdate: (convertedCoordinates: ConvertedCoordinateData) => void;
};

// https://stackoverflow.com/a/39399503
export const POSITIVE_DECIMAL_REGEX = /^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/;

export const INTEGER_REGEX = /^[0-9]\d*$/;

export function parseNumber(str: string): number | void {
  const num = Number.parseFloat(str);
  return isNaN(num) ? undefined : num;
}

export function getInitialCardinality(
  field: CoordinateField,
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
