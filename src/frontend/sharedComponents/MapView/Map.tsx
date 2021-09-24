import * as React from "react";
import MapboxGL, { OnPressEvent } from "@react-native-mapbox-gl/maps";
import { StyleSheet, View } from "react-native";
import ScaleBar from "react-native-scale-bar";

import config from "../../../config.json";
import bugsnag from "../../lib/logger";
import IconButton from "../IconButton";
import { LocationFollowingIcon, LocationNoFollowIcon } from "../icons";
import Loading from "../Loading";
import { OfflineMapLayers } from "../OfflineMapLayers";
import { ObservationMapLayer } from "./ObservationMapLayer";
import { MIN_DISPLACEMENT, Coordinates, SharedMapProps } from "./shared";

MapboxGL.setAccessToken(config.mapboxAccessToken);
// Forces Mapbox to always be in connected state, rather than reading system
// connectivity state
MapboxGL.setConnected(true);

// This is the default zoom used when the map first loads, and also the zoom
// that the map will zoom to if the user clicks the "Locate" button and the
// current zoom is < 12.
const DEFAULT_ZOOM = 12;

// The fallback map style does not include much detail, so at zoom 12 it looks
// empty. If the fallback map is used, then we use zoom 4 as the default zoom.
const DEFAULT_ZOOM_FALLBACK_MAP = 4;

interface Props extends SharedMapProps {
  isFocused: boolean;
  currentLocationCoordinates: Coordinates;
  locationServicesEnabled: boolean;
  measureDistance: (a: Coordinates, b: Coordinates) => number;
}

export const Map = React.memo(
  ({
    currentLocationCoordinates,
    isFocused,
    locationServicesEnabled,
    measureDistance,
    observations,
    onPressObservation = () => {},
    styleType,
    styleURL,
  }: Props) => {
    const [
      hasFinishedLoadingStyle,
      setHasFinishedLoadingStyle,
    ] = React.useState(false);
    const [following, setFollowing] = React.useState(locationServicesEnabled);
    const [zoom, setZoom] = React.useState(
      locationServicesEnabled ? DEFAULT_ZOOM_FALLBACK_MAP : 0.1
    );
    const [coords, setCoords] = React.useState(currentLocationCoordinates);

    const coordsRef = React.useRef<Coordinates>();
    const zoomRef = React.useRef<number>(zoom);

    React.useEffect(() => {
      MapboxGL.setTelemetryEnabled(false);
    }, []);

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
        const distanceMoved = measureDistance(
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
              centerCoordinate={
                following ? currentLocationCoordinates : undefined
              }
              zoomLevel={following ? zoomRef.current || zoom : undefined}
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
  },
  (prevProps, nextProps) => {
    // Don't update if screen was not focused and will not be focused
    if (!prevProps.isFocused && !nextProps.isFocused) {
      return true;
    }

    // Don't update if no props have changed
    if (!shallowDiffers(prevProps, nextProps)) {
      return true;
    }

    return false;
  }
);

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

// Shallow compare objects, but omitting certain keys from the comparison
function shallowDiffers(a: any, b: any) {
  for (const i in a) if (!(i in b)) return true;
  for (const i in b) {
    if (a[i] !== b[i]) return true;
  }
  return false;
}

function reportError() {
  bugsnag.notify(new Error("Failed to load map"), report => {
    report.severity = "error";
    report.context = "onDidFailLoadingMap";
  });
}
