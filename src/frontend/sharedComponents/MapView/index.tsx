import * as React from "react";
import MapboxGL, { OnPressEvent } from "@react-native-mapbox-gl/maps";
import CheapRuler from "cheap-ruler";
import { StyleSheet, View } from "react-native";
import ScaleBar from "react-native-scale-bar";

import config from "../../../config.json";
import type { LocationContextType } from "../../context/LocationContext";
import type { ObservationsMap } from "../../context/ObservationsContext";
import { useIsFullyFocused } from "../../hooks/useIsFullyFocused";
import type { MapStyleType } from "../../hooks/useMapStyle";
import bugsnag from "../../lib/logger";
import IconButton from "../IconButton";
import { LocationFollowingIcon, LocationNoFollowIcon } from "../icons";
import Loading from "../Loading";
import { OfflineMapLayers } from "../OfflineMapLayers";
import { ObservationMapLayer } from "./ObservationMapLayer";

// This is the default zoom used when the map first loads, and also the zoom
// that the map will zoom to if the user clicks the "Locate" button and the
// current zoom is < 12.
const DEFAULT_ZOOM = 12;
// The fallback map style does not include much detail, so at zoom 12 it looks
// empty. If the fallback map is used, then we use zoom 4 as the default zoom.
const DEFAULT_ZOOM_FALLBACK_MAP = 4;

MapboxGL.setAccessToken(config.mapboxAccessToken);
// Forces Mapbox to always be in connected state, rather than reading system
// connectivity state
MapboxGL.setConnected(true);

// Min distance in meters the user moves before the map will re-render (saves
// lots of map renders when the user is standing still, which uses up battery
// life)
const MIN_DISPLACEMENT = 15;

type Coordinates = [number, number];

interface Props {
  isFocused: boolean;
  observations: ObservationsMap;
  styleURL?: string;
  styleType: MapStyleType;
  location: LocationContextType;
  onPressObservation: (observationId: string) => void;
}

const Map = ({
  isFocused,
  location,
  observations,
  onPressObservation = () => {},
  styleType,
  styleURL,
}: Props) => {
  const locationServicesEnabled = !!location.provider?.locationServicesEnabled;
  const coordsFromLocation = getCoords(location);

  const [hasFinishedLoadingStyle, setHasFinishedLoadingStyle] = React.useState(
    false
  );
  const [following, setFollowing] = React.useState(locationServicesEnabled);
  const [zoom, setZoom] = React.useState(
    locationServicesEnabled ? DEFAULT_ZOOM_FALLBACK_MAP : 0.1
  );
  const [coords, setCoords] = React.useState(coordsFromLocation);
  const [cameraCenterCoord, setCameraCenterCoord] = React.useState(
    following ? coordsFromLocation : undefined
  );

  const coordsRef = React.useRef<Coordinates>();
  const lastCoordsRef = React.useRef<Coordinates>();
  const zoomRef = React.useRef<number>(zoom);
  const rulerRef = React.useRef(
    new CheapRuler(coordsFromLocation[1], "meters")
  );

  React.useEffect(() => {
    MapboxGL.setTelemetryEnabled(false);
  }, []);

  // TODO: Kind of uncertain about this implementation for optimizing Camera
  React.useEffect(() => {
    if (following) {
      const coords = lastCoordsRef.current || [0, 0];
      const newCoords = getCoords(location);
      const distanceMoved = rulerRef.current.distance(coords, newCoords);

      if (distanceMoved >= MIN_DISPLACEMENT) {
        // if the location has moved more than MIN_DISPLACEMENT meters, re-render
        // the map and remember the new coords to measure the next displacement
        lastCoordsRef.current = newCoords;
        setCameraCenterCoord(newCoords);
      } else {
        // Zoom back to original location when handleLocationPress is called
        setCameraCenterCoord(coords);
      }
    } else {
      setCameraCenterCoord(undefined);
    }
  }, [location, following]);

  const handleObservationPress = React.useCallback(
    (event: OnPressEvent) => {
      // contrary to the OnPressEvent type, `event.features` can be undefined here
      const pressedFeature = event.features && event.features[0];

      if (pressedFeature?.properties) {
        const { id: observationId } = pressedFeature.properties;
        bugsnag.leaveBreadcrumb("Press observation", { observationId });

        if (observations.get(observationId)) {
          onPressObservation(observationId);
        } else {
          bugsnag.notify(
            new Error("Could not find pressed observation"),
            report => {
              report.severity = "warning";
              report.context = "Could not find obs ID: " + observationId;
            }
          );
        }
      }
    },
    [observations]
  );

  const handleLocationPress = () => {
    if (!locationServicesEnabled) {
      // TODO: Show alert for the user here so they know why it does not work
      return;
    }
    // Sorry about this mess - when the user is interacting with the map we
    // don't setState, because it would be too slow, so we use this.zoomRef to
    // track the current map zoom. This means both this.zoomRef and setState
    // need to be called to update the zoom of the map. This should be fixed
    // with a better approach, because it can lead to bugs. For now, this code
    // just ensures that the map zooms in when the user clicks the "locate me"
    // button.
    const currentZoom = zoomRef.current;
    const newZoom = (zoomRef.current =
      styleType === "fallback"
        ? Math.max(currentZoom, DEFAULT_ZOOM_FALLBACK_MAP)
        : Math.max(currentZoom, DEFAULT_ZOOM));

    setZoom(newZoom);
    setFollowing(true);
  };

  const handleRegionWillChange = (event: any) => {
    if (!event.properties.isUserInteraction || !following) return;
    setFollowing(false);
  };

  const handleRegionIsChanging = (event: any) => {
    if (event.properties.isUserInteraction) {
      coordsRef.current = event.geometry.coordinates;
      zoomRef.current = event.properties.zoomLevel;
    }
  };

  const handleRegionDidChange = (event: any) => {
    if (event.properties.isUserInteraction) {
      const distanceMoved = rulerRef.current.distance(
        coords,
        event.geometry.coordinates
      );

      if (
        zoom === event.properties.zoomLevel &&
        distanceMoved < MIN_DISPLACEMENT
      ) {
        return;
      }

      setZoom(event.properties.zoomLevel);
      setCoords(event.geometry.coordinates);
    }
  };

  return (
    <>
      {styleURL === undefined || styleType === "loading" ? (
        <Loading />
      ) : (
        <MapboxGL.MapView
          testID="mapboxMapView"
          style={styles.mapView}
          logoEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          surfaceView
          attributionPosition={{ right: 8, bottom: 8 }}
          onPress={handleObservationPress}
          onDidFailLoadingMap={reportError}
          onDidFinishLoadingStyle={() => setHasFinishedLoadingStyle(true)}
          onDidFinishRenderingMap={() =>
            bugsnag.leaveBreadcrumb("onDidFinishRenderingMap")
          }
          onDidFinishRenderingMapFully={() => {
            if (styleType !== "fallback") {
              // For the fallback offline map (that does not contain much
              // detail) we stay at zoom 4, but if we do load a style then we
              // zoom in to zoom 12 once the map loads
              zoomRef.current = DEFAULT_ZOOM;
              setZoom(DEFAULT_ZOOM);
            }
            bugsnag.leaveBreadcrumb("onDidFinishRenderingMapFully");
          }}
          onWillStartLoadingMap={() =>
            bugsnag.leaveBreadcrumb("onWillStartLoadingMap")
          }
          onDidFinishLoadingMap={() =>
            bugsnag.leaveBreadcrumb("onDidFinishLoadingMap")
          }
          styleURL={styleURL}
          onRegionWillChange={handleRegionWillChange}
          onRegionIsChanging={handleRegionIsChanging}
          onRegionDidChange={handleRegionDidChange}
        >
          <MapboxGL.Camera
            defaultSettings={{
              centerCoordinate: coordsRef.current || coords || [0, 0],
              zoomLevel: zoomRef.current || zoom || DEFAULT_ZOOM,
            }}
            centerCoordinate={cameraCenterCoord}
            zoomLevel={!following ? undefined : zoomRef.current || zoom}
            animationDuration={1000}
            animationMode="flyTo"
            followUserLocation={false}
          />
          {hasFinishedLoadingStyle && (
            <ObservationMapLayer
              onPress={handleObservationPress}
              observations={observations}
            />
          )}
          {styleType === "fallback" && <OfflineMapLayers />}
          {locationServicesEnabled && (
            <MapboxGL.UserLocation
              visible={isFocused}
              minDisplacement={MIN_DISPLACEMENT}
            />
          )}
        </MapboxGL.MapView>
      )}
      <ScaleBar
        zoom={zoom || 10}
        latitude={coords ? coords[1] : undefined}
        bottom={20}
      />
      <View style={styles.locationButton}>
        <IconButton onPress={handleLocationPress}>
          {following ? <LocationFollowingIcon /> : <LocationNoFollowIcon />}
        </IconButton>
      </View>
    </>
  );
};

const MemoizedMap = React.memo(
  Map,
  // Don't update the map at all if the map is not the active screen
  (_prevProps, nextProps) => !nextProps.isFocused
);

export const MapView = (props: Props) => {
  const isFocused = useIsFullyFocused();
  return <MemoizedMap {...props} isFocused={isFocused} />;
};

const styles = StyleSheet.create({
  mapView: {
    flex: 1,
  },
  locationButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
});

function getCoords(location: LocationContextType): Coordinates {
  const pos = location.position || location.savedPosition;
  return pos ? [pos.coords.longitude, pos.coords.latitude] : [0, 0];
}

function reportError() {
  bugsnag.notify(new Error("Failed to load map"), report => {
    report.severity = "error";
    report.context = "onDidFailLoadingMap";
  });
}
