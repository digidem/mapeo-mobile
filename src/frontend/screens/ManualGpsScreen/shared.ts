export type CoordinateField = "lat" | "lon";

type Coordinates = { lat?: number | null; lon?: number | null };

export type ConvertedCoordinateData = {
  coords?: Coordinates;
  error?: Error;
};

export type FormProps = {
  onValueUpdate: (convertedCoordinates: ConvertedCoordinateData) => void;
};

// https://stackoverflow.com/a/39399503
export const POSITIVE_DECIMAL_REGEX = /^(0|[1-9]\d*)?(\.\d+)?(?<=\d)$/;

export const INTEGER_REGEX = /^[0-9]\d*$/;

export function parseNumber(str: string): number | void {
  const num = Number.parseFloat(str);
  return Number.isNaN(num) ? undefined : num;
}

export function getInitialCardinality(
  field: CoordinateField,
  coords?: Coordinates
) {
  if (field === "lat") {
    if (typeof coords?.lat !== "number") return "N";
    return coords.lat >= 0 ? "N" : "S";
  } else {
    if (typeof coords?.lon !== "number") return "E";
    return coords.lon >= 0 ? "E" : "W";
  }
}
