import * as React from "react";
import {
  fallbackStyleURL,
  MapStyleContext,
  onlineStyleURL,
} from "../context/MapStyleContext";

export const useDefaultStyleUrl = () => {
  const { onlineMapState } = React.useContext(MapStyleContext);

  return onlineMapState === "online" ? onlineStyleURL : fallbackStyleURL;
};
