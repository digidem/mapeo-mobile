import * as React from "react";
import { MapStyleContext } from "../context/MapStyleContext";

export const useMapServerState = () => {
  const { mapServerReady } = React.useContext(MapStyleContext);

  return React.useMemo(() => mapServerReady, [mapServerReady]);
};
