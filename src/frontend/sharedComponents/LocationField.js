// @flow
import * as React from "react";
import omit from "lodash/omit";

import { useDraftObservation } from "../hooks/useDraftObservation";
import LocationContext from "../context/LocationContext";

type Props = {
  children: ({
    longitude?: number | null,
    latitude?: number | null,
    accuracy?: number,
  }) => React.Node,
  locked: boolean,
};

/**
 * This component will update the draft observation location every time the GPS
 * location updates, if and only if the location has a better accuracy than the
 * location currently stored on the draft observation. If the property `locked`
 * is set then no updates will occur.
 * It needs a function as children, which will be called with the current
 * longitude, latitude and accuracy of the location on the observation
 */
const LocationField = ({ children, locked }: Props) => {
  const [{ value }, { updateDraft }] = useDraftObservation();
  const location = React.useContext(LocationContext);

  React.useEffect(() => {
    if (locked || !location.position || !value) return;
    const draftHasManualLocation =
      value.metadata && value.metadata.manualLocation;
    const draftHasLocation =
      typeof value.lat !== "undefined" && typeof value.lon !== "undefined";
    const accuracyImproved =
      value.metadata &&
      value.metadata.location &&
      value.metadata.location.position &&
      location.position.coords.accuracy <
        value.metadata.location.position.coords.accuracy;
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
  }, [location, updateDraft, value, locked]);

  if (!value) return null;

  return children({
    longitude: value.lon,
    latitude: value.lat,
    accuracy:
      value.metadata &&
      value.metadata.location &&
      value.metadata.location.position &&
      value.metadata.location.position.coords.accuracy,
  });
};

// Add props from DraftObservation and location to component
export default LocationField;
