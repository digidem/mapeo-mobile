// @flow
import * as React from "react";
import { Text } from "react-native";

import { formatCoords } from "../lib/utils";
import type { Style } from "../types";

type Props = {
  lat: number,
  lon: number,
  style?: Style<typeof Text>
};

// This is a placeholder. Once we add coordinate format settings, this will read
// from settings context and format accordingly
const FormattedCoords = ({ lat, lon, style }: Props) => {
  return <Text style={style}>{formatCoords({ lon, lat })}</Text>;
};

export default FormattedCoords;
