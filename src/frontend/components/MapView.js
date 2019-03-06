// @flow
import React from "react";
import MapboxGL from "@mapbox/react-native-mapbox-gl";

import type { MapStyle } from "../types/map";
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

/**
 * Convert a map of observations into a GeoJSON FeatureCollection
 *
 * @param {{ [string]: ObservationType }} Observations
 * @returns GeoJSON FeatureCollection with Features that have the observation
 * location and id
 */
function mapObservationsToFeatures(obs: { [string]: ObservationType }) {
  if (!obs || Object.keys(obs).length === 0) return [];
  return Object.keys(obs)
    .filter(
      id =>
        typeof obs[id].lon !== "undefined" && typeof obs[id].lat !== "undefined"
    )
    .map(id => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [obs[id].lon, obs[id].lat]
      },
      properties: {
        id: id,
        categoryId: obs[id].categoryId
      }
    }));
}

class ObservationMapLayer extends React.PureComponent<{
  onPress: Function,
  observations: {
    [id: string]: ObservationType
  }
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
  observations: {
    [id: string]: ObservationType
  },
  mapStyle: MapStyle,
  onPressObservation: (observationId: string) => void,
  onPressNew: () => void
};

class Map extends React.Component<Props> {
  static defaultProps = {
    observations: [],
    onPressObservation: () => null,
    onPressNew: () => null
  };

  constructor(props: Props) {
    super(props);
    MapboxGL.setAccessToken(
      "pk.eyJ1IjoiZ21hY2xlbm5hbiIsImEiOiJSaWVtd2lRIn0.ASYMZE2HhwkAw4Vt7SavEg"
    );
    log("accessToken set");
  }

  map: any;

  handleObservationPress = e => {
    const pressedFeature = e.nativeEvent && e.nativeEvent.payload;
    if (!pressedFeature || !pressedFeature.properties) return;

    const observationId = pressedFeature.properties.id;
    const { observations, onPressObservation } = this.props;
    if (observations[observationId]) {
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
    const { observations } = this.props;

    return (
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
    );
  }
}

export default Map;
