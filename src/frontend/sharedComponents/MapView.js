// @flow
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import ScaleBar from "react-native-scale-bar";
import cheapRuler from "cheap-ruler";

// import type { MapStyle } from "../types";
import { LocationFollowingIcon, LocationNoFollowIcon } from "./icons";
import IconButton from "./IconButton";
import withNavigationFocus from "../lib/withNavigationFocus";
import type { LocationContextType } from "../context/LocationContext";
import type { ObservationsMap } from "../context/ObservationsContext";
import bugsnag from "../lib/logger";
import config from "../../config.json";
import Loading from "./Loading";

MapboxGL.setAccessToken(config.mapboxAccessToken);
// Forces Mapbox to always be in connected state, rather than reading system
// connectivity state
MapboxGL.setConnected(true);

const mapboxStyles = {
  observation: {
    circleColor: "#F29D4B",
    circleRadius: 5,
    circleStrokeColor: "#fff",
    circleStrokeWidth: 2
  }
};

type ObservationFeature = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [number, number] | [number, number, number]
  },
  properties: {| id: string |}
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
          coordinates: [obs.value.lon, obs.value.lat]
        },
        properties: {
          id: obs.id
        }
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
  observations: ObservationsMap
}> {
  render() {
    const { onPress, observations } = this.props;
    const featureCollection = {
      type: "FeatureCollection",
      features: mapObservationsToFeatures(observations)
    };
    return (
      <MapboxGL.ShapeSource
        onPress={onPress}
        id={`observations-source`}
        shape={featureCollection}>
        <MapboxGL.CircleLayer id={`circles`} style={mapboxStyles.observation} />
      </MapboxGL.ShapeSource>
    );
  }
}

type Props = {
  observations: ObservationsMap,
  styleURL: string,
  location: LocationContextType,
  onPressObservation: (observationId: string) => any,
  isFocused: boolean
};

type State = {
  // True if the map is following user location
  following: boolean,
  hasFinishedLoadingStyle?: boolean,
  zoom: number,
  // lon, lat
  coords: [number, number]
};

type Coords = [number, number];

function getCoords(location: LocationContextType): [number, number] {
  const pos = location.position || location.savedPosition;
  return pos ? [pos.coords.longitude, pos.coords.latitude] : [0, 0];
}

class MapView extends React.Component<Props, State> {
  static defaultProps = {
    onAddPress: () => {},
    onPressObservation: () => {}
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
      zoom: 12,
      coords: getCoords(props.location)
    };

    this.ruler = cheapRuler(getCoords(props.location)[1], "meters");
  }

  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);
  }

  // We only use the location prop (which contains the app GPS location) for the
  // first render of the map. After that location updates come from the native
  // map view, so we don't want to re-render this component every time there is
  // a GPS update, only when the location provider status changes, which we use
  // to render the map in follow-mode or not.
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

  handleObservationPress = (e: {
    nativeEvent?: {
      payload?: {
        properties?: { id: string }
      }
    }
  }) => {
    const pressedFeature = e.nativeEvent && e.nativeEvent.payload;
    if (!pressedFeature || !pressedFeature.properties) return;

    const observationId = pressedFeature.properties.id;
    bugsnag.leaveBreadcrumb("Press observation", { observationId });
    const { observations, onPressObservation } = this.props;
    if (observations.get(observationId)) {
      onPressObservation(observationId);
    } else {
      bugsnag.notify(new Error("Could not find pressed observation"), {
        observationId
      });
    }
  };

  handleMapViewRef = (c: any) => {
    this.map = c;
  };

  handleRegionWillChange = (e: any) => {
    if (!e.properties.isUserInteraction || !this.state.following) return;
    // Any user interaction with the map switches follow mode to false
    this.setState({ following: false });
  };

  handleRegionIsChanging = (e: any) => {
    this.coordsRef = e.geometry.coordinates;
    this.zoomRef = e.properties.zoomLevel;
  };

  handleRegionDidChange = (e: any) => {
    const { coords, zoom } = this.state;
    const distanceMoved = this.ruler.distance(coords, e.geometry.coordinates);
    if (zoom === e.properties.zoomLevel && distanceMoved < MIN_DISPLACEMENT)
      return;
    this.setState({
      zoom: e.properties.zoomLevel,
      coords: e.geometry.coordinates
    });
  };

  handleDidFinishLoadingStyle = e => {
    this.setState({ hasFinishedLoadingStyle: true });
  };

  handleLocationPress = () => {
    const { location } = this.props;
    if (!(location.provider && location.provider.locationServicesEnabled))
      return;
    this.setState(state => ({ following: !state.following }));
  };

  render() {
    const { observations, styleURL, isFocused, location } = this.props;
    const { zoom, coords, following } = this.state;
    const locationServicesEnabled =
      location.provider && location.provider.locationServicesEnabled;
    return (
      <>
        {styleURL === "loading" ? (
          <Loading />
        ) : styleURL === "error" ? (
          <View style={{ flex: 1 }}>
            <Text>Error loading map</Text>
          </View>
        ) : (
          <MapboxGL.MapView
            testID="mapboxMapView"
            style={{ flex: 1 }}
            ref={this.handleMapViewRef}
            maxZoomLevel={22}
            logoEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            onPress={this.handleObservationPress}
            onDidFailLoadingMap={e =>
              bugsnag.notify(e, {
                severity: "error",
                context: "onDidFailLoadingMap"
              })
            }
            onDidFinishLoadingStyle={this.handleDidFinishLoadingStyle}
            onDidFinishRenderingMap={() =>
              bugsnag.leaveBreadcrumb("onDidFinishRenderingMap")
            }
            onDidFinishRenderingMapFully={() =>
              bugsnag.leaveBreadcrumb("onDidFinishRenderingMapFully")
            }
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
            onRegionDidChange={this.handleRegionDidChange}>
            {following && (
              <MapboxGL.Camera
                defaultSettings={{
                  centerCoordinate: this.coordsRef || coords || [0, 0],
                  zoomLevel: this.zoomRef || zoom
                }}
                animationDuration={1000}
                centerCoordinate={getCoords(location)}
                zoomLevel={
                  (this.zoomRef || zoom) < 12 ? 12 : this.zoomRef || zoom
                }
                animationMode="flyTo"
              />
            )}
            {locationServicesEnabled && (
              <MapboxGL.UserLocation
                visible={isFocused}
                minDisplacement={MIN_DISPLACEMENT}
              />
            )}
            {this.state.hasFinishedLoadingStyle && (
              <ObservationMapLayer
                onPress={this.handleObservationPress}
                observations={observations}
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

export default withNavigationFocus(MapView);

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
    bottom: 20
  }
});
