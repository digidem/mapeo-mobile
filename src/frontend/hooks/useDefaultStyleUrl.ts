import * as React from "react";
import {
  fallbackStyleURL,
  MapStyleContext,
  onlineStyleURL,
} from "../context/MapStyleContext";

export const useDefaultStyleUrl = () => {
  const { mapServerReady, onlineMapState } = React.useContext(MapStyleContext);

  if (!mapServerReady) return null;

  return onlineMapState === "online" ? onlineStyleURL : fallbackStyleURL;
};
