// @flow
import * as React from "react";
import { Text } from "react-native";
import { fromLatLon } from "utm";
import type { Style } from "../types/other";

type Props = {
  lat: number,
  lon: number,
  style?: Style<typeof Text>
};

const FormattedCoords = ({ lat, lon, style }: Props) => {
  let { easting, northing, zoneNum, zoneLetter } = fromLatLon(lat, lon);
  easting = leftPad(easting.toFixed(), 6, "0");
  northing = leftPad(northing.toFixed(), 6, "0");
  const coordString = `UTM ${zoneNum}${zoneLetter} ${easting} ${northing}`;
  return <Text style={style}>{coordString}</Text>;
};

export default FormattedCoords;

function leftPad(str: string, len: number, ch: string) {
  // doesn't need to pad
  len = len - str.length;
  if (len <= 0) return str;

  var pad = "";
  while (true) {
    if (len & 1) pad += ch;
    len >>= 1;
    if (len) ch += ch;
    else break;
  }
  return pad + str;
}
