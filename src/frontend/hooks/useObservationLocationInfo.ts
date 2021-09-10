import * as React from "react";
import omit from "lodash/omit";

import LocationContext from "../context/LocationContext";
import { useDraftObservation } from "./useDraftObservation";

export const useObservationLocationInfo = (): {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
} | null => {
  const [{ value }, { updateDraft }] = useDraftObservation();
  const location = React.useContext(LocationContext);

  React.useEffect(() => {
    if (!location.position || !value) return;
    const draftHasManualLocation =
      value.metadata && value.metadata.manualLocation;
    const draftHasLocation =
      typeof value.lat !== "undefined" && typeof value.lon !== "undefined";

    const locationAccuracy = location.position.coords.accuracy;
    const draftAccuracy = value?.metadata?.location?.position?.coords.accuracy;
    const accuracyImproved =
      typeof locationAccuracy === "number" &&
      typeof draftAccuracy === "number" &&
      locationAccuracy < draftAccuracy;
    if (!draftHasManualLocation && (!draftHasLocation || accuracyImproved))
      return updateDraft({
        ...value,
        lon: location.position.coords.longitude,
        lat: location.position.coords.latitude,
        metadata: {
          ...value.metadata,
          location: omit(location, "savedPosition"),
        },
      });
  }, [location, updateDraft, value]);

  if (!value) return null;

  return {
    longitude: value.lon || null,
    latitude: value.lat || null,
    accuracy: value.metadata?.location?.position?.coords?.accuracy || null,
  };
};
