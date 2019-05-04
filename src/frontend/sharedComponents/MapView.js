// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import MapboxGL from "@react-native-mapbox/maps";
import debug from "debug";

// import type { MapStyle } from "../types";
import AddButton from "./AddButton";
import { LocationFollowingIcon, LocationNoFollowIcon } from "./icons";
import IconButton from "./IconButton";
import type {
  LocationContextType,
  PositionType
} from "../context/LocationContext";
import type { ObservationsMap } from "../context/ObservationsContext";

const log = debug("mapeo:MapView");

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
  for (let obs of obsMap.values()) {
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
        shape={featureCollection}
      >
        <MapboxGL.CircleLayer id={`circles`} style={mapboxStyles.observation} />
      </MapboxGL.ShapeSource>
    );
  }
}

type Props = {
  observations: ObservationsMap,
  styleURL: string,
  location: LocationContextType,
  onAddPress: () => any,
  onPressObservation: (observationId: string) => any
};

type State = {
  // True if the map is following user location
  following: boolean
};

class MapView extends React.Component<Props, State> {
  static defaultProps = {
    onAddPress: () => {},
    onPressObservation: () => {}
  };
  state = { following: true };
  map: any;
  initialPosition: void | null | PositionType;

  constructor(props: Props) {
    super(props);
    MapboxGL.setAccessToken(
      "pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
    );
    MapboxGL.setTelemetryEnabled(false);
    log("accessToken set");
    this.initialPosition =
      props.location.position || props.location.savedPosition;
  }

  // We only use the location prop (which contains the app GPS location) for the
  // first render of the map. After that location updates come from the native
  // map view, so we don't want to re-render this component every time there is
  // a GPS update
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      shallowDiffers(this.props, nextProps, ["location"]) ||
      shallowDiffers(this.state, nextState, ["location"])
    );
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
    log("handle obs press", observationId);
    const { observations, onPressObservation } = this.props;
    if (observations.get(observationId)) {
      onPressObservation(observationId);
    } else {
      log(
        "Warning: pressed feature with id '" +
          observationId +
          "' but could not find matching observation"
      );
    }
  };

  handleMapViewRef = (c: any) => {
    this.map = c;
  };

  handleRegionChange = (e: any) => {
    // Any user interaction with the map switches follow mode to false
    if (e.properties.isUserInteraction) this.setState({ following: false });
  };

  handleLocationPress = () => {
    this.setState(state => ({ following: !state.following }));
  };

  render() {
    const { observations, onAddPress, styleURL } = this.props;
    const initialCoords = this.initialPosition
      ? [
          this.initialPosition.coords.longitude,
          this.initialPosition.coords.latitude
        ]
      : [0, 0];
    const initialZoom = this.initialPosition ? 8 : 0;
    return (
      <>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          ref={this.handleMapViewRef}
          maxZoomLevel={22}
          surfaceView
          logoEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          onPress={this.handleObservationPress}
          compassEnabled={false}
          styleURL={styleURL}
          onRegionWillChange={this.handleRegionChange}
          regionWillChangeDebounceTime={200}
        >
          {!this.state.following && (
            <MapboxGL.UserLocation showUserLocation={true} />
          )}
          <MapboxGL.Camera
            centerCoordinate={initialCoords}
            zoomLevel={initialZoom}
            followUserLocation={this.state.following}
            followZoomLevel={12}
          />
          <ObservationMapLayer
            onPress={this.handleObservationPress}
            observations={observations}
          />
        </MapboxGL.MapView>
        <AddButton onPress={onAddPress} />
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

export default MapView;

// Shallow compare objects, but omitting certain keys from the comparison
function shallowDiffers(a: any, b: any, omit: string[]) {
  for (let i in a) if (!(i in b)) return true;
  for (let i in b) {
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
