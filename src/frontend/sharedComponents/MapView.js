// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import MapboxGL, { Logger } from "@react-native-mapbox-gl/maps";
import ScaleBar from "react-native-scale-bar";
import CheapRuler from "cheap-ruler";

// import type { MapStyle } from "../types";
import { LocationFollowingIcon, LocationNoFollowIcon } from "./icons";
import IconButton from "./IconButton";
import type { LocationContextType } from "../context/LocationContext";
import type { ObservationsMap } from "../context/ObservationsContext";
import type { MapStyleType } from "../hooks/useMapStyle";
import { useIsFullyFocused } from "../hooks/useIsFullyFocused";
import bugsnag from "../lib/logger";
import config from "../../config.json";
import Loading from "./Loading";
import OfflineMapLayers from "./OfflineMapLayers";

// This is the default zoom used when the map first loads, and also the zoom
// that the map will zoom to if the user clicks the "Locate" button and the
// current zoom is < 12.
const DEFAULT_ZOOM = 12;
// The fallback map style does not include much detail, so at zoom 12 it looks
// empty. If the fallback map is used, then we use zoom 4 as the default zoom.
const DEFAULT_ZOOM_FALLBACK_MAP = 4;

// Suppress expected warnings in logs - see https://github.com/react-native-mapbox-gl/maps/issues/943#issuecomment-759220852
Logger.setLogCallback(log => {
  const { message } = log;

  // expected warnings - see https://github.com/mapbox/mapbox-gl-native/issues/15341#issuecomment-522889062
  return (
    message.match("Request failed due to a permanent error: Canceled") ||
    message.match("Request failed due to a permanent error: Socket Closed")
  );
});

MapboxGL.setAccessToken(config.mapboxAccessToken);
// Forces Mapbox to always be in connected state, rather than reading system
// connectivity state
MapboxGL.setConnected(true);

const mapboxStyles = {
  observation: {
    circleColor: "#F29D4B",
    circleRadius: 5,
    circleStrokeColor: "#fff",
    circleStrokeWidth: 2,
  },
};

type ObservationFeature = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [number, number] | [number, number, number],
  },
  properties: {| id: string |},
};

/**
 * Convert a map of observations into a GeoJSON FeatureCollection
 *
 * @param {{ [string]: ObservationType }} Observations
 * @returns GeoJSON FeatureCollection with Features that have the observation
 * location and id
 */
function mapObservationsToFeatures(
  obsMap: ObservationsMap
): ObservationFeature[] {
  const features = [];
  for (const obs of obsMap.values()) {
    // Only include observations with a location in the map view
    if (
      typeof obs.value.lon === "number" &&
      typeof obs.value.lat === "number"
    ) {
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [obs.value.lon, obs.value.lat],
        },
        properties: {
          id: obs.id,
        },
      });
    }
  }
  return features;
}

// Min distance in meters the user moves before the map will re-render (saves
// lots of map renders when the user is standing still, which uses up battery
// life)
const MIN_DISPLACEMENT = 15;

class ObservationMapLayer extends React.PureComponent<{
  onPress: Function,
  observations: ObservationsMap,
}> {
  render() {
    const { onPress, observations } = this.props;
    const featureCollection = {
      type: "FeatureCollection",
      features: mapObservationsToFeatures(observations),
    };
    return (
      <MapboxGL.ShapeSource
        onPress={onPress}
        id={`observations-source`}
        shape={featureCollection}
      >
        <MapboxGL.CircleLayer id={`circles`} style={mapboxStyles.observation} />
      </MapboxGL.ShapeSource>
    );
  }
}

type Props = {
  observations: ObservationsMap,
  styleURL: string | void,
  styleType: MapStyleType,
  location: LocationContextType,
  onPressObservation: (observationId: string) => any,
  isFocused: boolean,
};

type State = {
  // True if the map is following user location
  following: boolean,
  hasFinishedLoadingStyle?: boolean,
  zoom: number,
  // lon, lat
  coords: [number, number],
};

type Coords = [number, number];

function getCoords(location: LocationContextType): [number, number] {
  const pos = location.position || location.savedPosition;
  return pos ? [pos.coords.longitude, pos.coords.latitude] : [0, 0];
}

class MapView extends React.Component<Props, State> {
  static defaultProps = {
    onAddPress: () => {},
    onPressObservation: () => {},
  };
  map: any;
  coordsRef: Coords;
  zoomRef: number;
  lastCoords: ?Coords;
  ruler: { distance: (Coords, Coords) => number };

  constructor(props: Props) {
    super(props);
    this.state = {
      following:
        !!props.location.provider &&
        props.location.provider.locationServicesEnabled,
      zoom:
        props.location.provider &&
        props.location.provider.locationServicesEnabled
          ? DEFAULT_ZOOM_FALLBACK_MAP
          : 0.1,
      coords: getCoords(props.location),
    };
    this.zoomRef = this.state.zoom;

    this.ruler = new CheapRuler(getCoords(props.location)[1], "meters");
  }

  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);
  }

  // Instead of using <MapboxGL.Camera> for following user location (because it
  // causes CPU usage to rise to 150% because it frequently re-renders the map)
  // we update the coordinates of the map every time the location changes by
  // more than MIN_DISPLACEMENT meters. When the coords update,
  // <MapboxGL.Camera> (in non-follow-mode) will animate a transition to the new
  // location
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    // Don't update the map at all if the map is not the active screen
    if (!nextProps.isFocused) return false;
    const coords = this.lastCoords || [0, 0];
    const nextCoords = getCoords(nextProps.location);
    const distanceMoved = this.ruler.distance(coords, nextCoords);
    // Update if any props other than location have changed
    if (
      shallowDiffers(this.props, nextProps, ["location"]) ||
      shallowDiffers(this.state, nextState)
    )
      return true;
    if (distanceMoved >= MIN_DISPLACEMENT) {
      // if the location has moved more than MIN_DISPLACEMENT meters, re-render
      // the map and remember the new coords to measure the next displacement
      this.lastCoords = nextCoords;
      return true;
    } else {
      return false;
    }
  }

  handleObservationPress = (event: {
    features?: {
      properties?: { id: string },
    }[],
  }) => {
    const pressedFeature = event.features && event.features[0];

    if (!pressedFeature || !pressedFeature.properties) return;

    const observationId = pressedFeature.properties.id;
    bugsnag.leaveBreadcrumb("Press observation", { observationId });
    const { observations, onPressObservation } = this.props;
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
  };

  handleMapViewRef = (c: any) => {
    this.map = c;
  };

  handleRegionWillChange = (e: any) => {
    if (!e.properties.isUserInteraction || !this.state.following) return;
    this.setState({ following: false });
  };

  handleRegionIsChanging = (e: any) => {
    if (!e.properties.isUserInteraction) return;
    this.coordsRef = e.geometry.coordinates;
    this.zoomRef = e.properties.zoomLevel;
  };

  handleRegionDidChange = (e: any) => {
    if (!e.properties.isUserInteraction) return;
    const { coords, zoom } = this.state;
    const distanceMoved = this.ruler.distance(coords, e.geometry.coordinates);
    if (zoom === e.properties.zoomLevel && distanceMoved < MIN_DISPLACEMENT)
      return;
    this.setState({
      zoom: e.properties.zoomLevel,
      coords: e.geometry.coordinates,
    });
  };

  handleDidFinishLoadingStyle = e => {
    this.setState({ hasFinishedLoadingStyle: true });
  };

  handleLocationPress = () => {
    const { location, styleType } = this.props;
    if (!(location.provider && location.provider.locationServicesEnabled))
      // TODO: Show alert for the user here so they know why it does not work
      return;
    // Sorry about this mess - when the user is interacting with the map we
    // don't setState, because it would be too slow, so we use this.zoomRef to
    // track the current map zoom. This means both this.zoomRef and setState
    // need to be called to update the zoom of the map. This should be fixed
    // with a better approach, because it can lead to bugs. For now, this code
    // just ensures that the map zooms in when the user clicks the "locate me"
    // button.
    const currentZoom = this.zoomRef;
    this.setState(state => {
      const newZoom = (this.zoomRef =
        styleType === "fallback"
          ? Math.max(currentZoom, DEFAULT_ZOOM_FALLBACK_MAP)
          : Math.max(currentZoom, DEFAULT_ZOOM));
      return {
        following: !state.following,
        zoom: newZoom,
      };
    });
  };

  render() {
    const {
      observations,
      styleURL,
      styleType,
      isFocused,
      location,
    } = this.props;
    const { zoom, coords, following } = this.state;
    const locationServicesEnabled =
      location.provider && location.provider.locationServicesEnabled;
    return (
      <>
        {styleURL === undefined || styleType === "loading" ? (
          <Loading />
        ) : (
          <MapboxGL.MapView
            testID="mapboxMapView"
            style={{ flex: 1 }}
            ref={this.handleMapViewRef}
            maxZoomLevel={22}
            logoEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            surfaceView={true}
            attributionPosition={{ right: 8, bottom: 8 }}
            onPress={this.handleObservationPress}
            onDidFailLoadingMap={e =>
              bugsnag.notify(new Error("Failed to load map"), report => {
                report.severity = "error";
                report.context = "onDidFailLoadingMap";
              })
            }
            onDidFinishLoadingStyle={this.handleDidFinishLoadingStyle}
            onDidFinishRenderingMap={() =>
              bugsnag.leaveBreadcrumb("onDidFinishRenderingMap")
            }
            onDidFinishRenderingMapFully={() => {
              if (styleType !== "fallback") {
                // For the fallback offline map (that does not contain much
                // detail) we stay at zoom 4, but if we do load a style then we
                // zoom in to zoom 12 once the map loads
                this.zoomRef = DEFAULT_ZOOM;
                this.setState({ zoom: DEFAULT_ZOOM });
              }
              bugsnag.leaveBreadcrumb("onDidFinishRenderingMapFully");
            }}
            onWillStartLoadingMap={() =>
              bugsnag.leaveBreadcrumb("onWillStartLoadingMap")
            }
            onDidFinishLoadingMap={() =>
              bugsnag.leaveBreadcrumb("onDidFinishLoadingMap")
            }
            compassEnabled={false}
            styleURL={styleURL}
            onRegionWillChange={this.handleRegionWillChange}
            onRegionIsChanging={this.handleRegionIsChanging}
            onRegionDidChange={this.handleRegionDidChange}
          >
            <MapboxGL.Camera
              defaultSettings={{
                centerCoordinate: this.coordsRef || coords || [0, 0],
                zoomLevel: this.zoomRef || zoom || DEFAULT_ZOOM,
              }}
              centerCoordinate={following ? getCoords(location) : undefined}
              zoomLevel={!following ? undefined : this.zoomRef || zoom}
              animationDuration={1000}
              animationMode="flyTo"
              followUserLocation={false}
            />
            {this.state.hasFinishedLoadingStyle && (
              <ObservationMapLayer
                onPress={this.handleObservationPress}
                observations={observations}
              />
            )}
            {styleType === "fallback" ? <OfflineMapLayers /> : null}
            {locationServicesEnabled ? (
              <MapboxGL.UserLocation
                visible={isFocused}
                minDisplacement={MIN_DISPLACEMENT}
              />
            ) : null}
          </MapboxGL.MapView>
        )}
        <ScaleBar
          zoom={zoom || 10}
          latitude={coords ? coords[1] : undefined}
          bottom={20}
        />
        <View style={styles.locationButton}>
          <IconButton onPress={this.handleLocationPress}>
            {this.state.following ? (
              <LocationFollowingIcon />
            ) : (
              <LocationNoFollowIcon />
            )}
          </IconButton>
        </View>
      </>
    );
  }
}

const FocusAwareMapView = (props: $Diff<Props, {| isFocused: boolean |}>) => {
  const isFocused = useIsFullyFocused();
  return <MapView {...props} isFocused={isFocused} />;
};

export default FocusAwareMapView;

// Shallow compare objects, but omitting certain keys from the comparison
function shallowDiffers(a: any, b: any, omit: string[] = []) {
  for (const i in a) if (!(i in b)) return true;
  for (const i in b) {
    if (a[i] !== b[i] && omit.indexOf(i) === -1) return true;
  }
  return false;
}

const styles = StyleSheet.create({
  locationButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
});
