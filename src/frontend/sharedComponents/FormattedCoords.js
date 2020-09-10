// @flow
import * as React from "react";

import { formatCoords } from "../lib/utils";

type Props = {
  lat: number,
  lon: number,
};

// This is a placeholder. Once we add coordinate format settings, this will read
// from settings context and format accordingly
const FormattedCoords = ({ lat, lon }: Props) => {
  return <>{formatCoords({ lon, lat })}</>;
};

export default FormattedCoords;
