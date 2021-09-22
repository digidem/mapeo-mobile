import * as React from "react";
import MapboxGL, { OnPressEvent } from "@react-native-mapbox-gl/maps";
import { ObservationsMap } from "../../context/ObservationsContext";

const MAPBOX_STYLES = {
  observation: {
    circleColor: "#F29D4B",
    circleRadius: 5,
    circleStrokeColor: "#fff",
    circleStrokeWidth: 2,
  },
};

interface ObservationFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number] | [number, number, number];
  };
  properties: { id: string };
}

interface Props {
  observations: ObservationsMap;
  onPress: (event: OnPressEvent) => void;
}

export const ObservationMapLayer = React.memo(
  ({ observations, onPress }: Props) => {
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
        <MapboxGL.CircleLayer
          id={`circles`}
          style={MAPBOX_STYLES.observation}
        />
      </MapboxGL.ShapeSource>
    );
  }
);

/**
 * Convert a map of observations into a GeoJSON FeatureCollection
 * Returns a GeoJSON FeatureCollection with Features that have the observation
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
      } as ObservationFeature);
    }
  }
  return features;
}
