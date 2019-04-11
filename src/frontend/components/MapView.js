// @flow
import React from "react";
import MapboxGL from "@mapbox/react-native-mapbox-gl";

import type { MapStyle } from "../types/map";
import type { ObservationsMap } from "../context/ObservationsContext";
import AddButton from "../components/AddButton";
import debug from "debug";

const log = debug("mapeo:MapView");

const mapboxStyles = MapboxGL.StyleSheet.create({
  observation: {
    circleColor: "#F29D4B",
    circleRadius: 5,
    circleStrokeColor: "#fff",
    circleStrokeWidth: 2
  }
});

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
  mapStyle?: MapStyle,
  onAddPress: () => void,
  onPressObservation: (observationId: string) => void
};

class MapView extends React.Component<Props> {
  static defaultProps = {
    onAddPress: () => {},
    onPressObservation: () => {}
  };

  constructor(props: Props) {
    super(props);
    MapboxGL.setAccessToken(
      "pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
    );
    MapboxGL.setTelemetryEnabled(false);
    log("accessToken set");
  }

  map: any;

  handleObservationPress = (e: {
    nativeEvent?: {
      payload?: {
        properties?: { id: string }
      }
    }
  }) => {
    log("handle obs press");
    const pressedFeature = e.nativeEvent && e.nativeEvent.payload;
    if (!pressedFeature || !pressedFeature.properties) return;

    const observationId = pressedFeature.properties.id;
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

  render() {
    const { observations, onAddPress } = this.props;

    return (
      <>
        <MapboxGL.MapView
          style={{ flex: 1 }}
          ref={this.handleMapViewRef}
          maxZoomLevel={22}
          logoEnabled
          pitchEnabled={false}
          rotateEnabled={false}
          onPress={this.handleObservationPress}
          compassEnabled={false}
          styleURL="mapbox://styles/mapbox/outdoors-v9"
        >
          <ObservationMapLayer
            onPress={this.handleObservationPress}
            observations={observations}
          />
        </MapboxGL.MapView>
        <AddButton onPress={onAddPress} />
      </>
    );
  }
}

export default MapView;
