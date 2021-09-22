import * as React from "react";
import CheapRuler from "cheap-ruler";

import { LocationContextType } from "../../context/LocationContext";
import { useIsFullyFocused } from "../../hooks/useIsFullyFocused";
import { Map } from "./Map";
import { MIN_DISPLACEMENT, Coordinates, SharedMapProps } from "./shared";

interface Props extends SharedMapProps {
  location: LocationContextType;
}

export const MapView = ({ location, ...otherProps }: Props) => {
  const isFocused = useIsFullyFocused();

  const recentCoordsFromLocation = getCoords(location);

  const [cachedLocationCoords, setCachedLocationCoords] = React.useState(
    recentCoordsFromLocation
  );
  const rulerRef = React.useRef(
    new CheapRuler(cachedLocationCoords[1], "meters")
  );

  const measureDistance = React.useCallback(
    (a: Coordinates, b: Coordinates) => rulerRef.current.distance(a, b),
    []
  );

  React.useEffect(() => {
    setCachedLocationCoords(previousCachedCoords => {
      const distanceMoved = measureDistance(
        previousCachedCoords,
        recentCoordsFromLocation
      );

      // If the location has moved more than MIN_DISPLACEMENT meters,
      // set the cache to the new coords to re-render the map
      // and use this value to measure the next displacement
      return distanceMoved >= MIN_DISPLACEMENT
        ? recentCoordsFromLocation
        : previousCachedCoords;
    });
  }, [recentCoordsFromLocation, measureDistance]);

  return (
    <Map
      {...otherProps}
      currentLocationCoordinates={cachedLocationCoords}
      isFocused={isFocused}
      locationServicesEnabled={!!location.provider?.locationServicesEnabled}
      measureDistance={measureDistance}
    />
  );
};

function getCoords(location: LocationContextType): Coordinates {
  const pos = location.position || location.savedPosition;
  return pos ? [pos.coords.longitude, pos.coords.latitude] : [0, 0];
}
