import * as React from "react";
import ky from "ky";
import MapboxGL from "@react-native-mapbox-gl/maps";

import api from "../api";
import { normalizeStyleURL } from "../lib/mapbox";
import env from "../../../env";

/** URL used for map style when no custom map and user is online */
export const onlineStyleURL = normalizeStyleURL(
  MapboxGL.StyleURL.Outdoors + "?" + Date.now(),
  env.MAPBOX_ACCESS_TOKEN
);

export type MapAvailability = "unknown" | "available" | "unavailable";

/**
 * Returns the current availability of either the default online map (e.g. is
 * the user online) or a custom map (e.g. has the user added a legacy custom
 * map). Re-checks on remount.
 */
export function useMapAvailability(mapType: "online" | "custom") {
  const [mapAvailability, setMapAvailability] = React.useState<MapAvailability>(
    "unknown"
  );

  // TODO: either poll for connectivity changes, or detect network status (often done by polling anyway)
  React.useEffect(() => {
    if (mapType !== "online") return;
    let didCancel = false;

    // TODO: HEAD request on this should be quicker and give us what we need.
    ky.get(onlineStyleURL)
      .json()
      .then(() => didCancel || setMapAvailability("available"))
      .catch(() => didCancel || setMapAvailability("unavailable"));

    return () => {
      didCancel = true;
    };
  }, [mapType]);

  React.useEffect(() => {
    if (mapType !== "custom") return;
    let didCancel = false;

    api
      .getMapStyle("default")
      .then(() => didCancel || setMapAvailability("available"))
      .catch(() => didCancel || setMapAvailability("unavailable"));
    return () => {
      didCancel = true;
    };
  }, [mapType]);

  return mapAvailability;
}
