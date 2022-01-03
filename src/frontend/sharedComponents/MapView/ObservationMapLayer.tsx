import * as React from "react";
import MapboxGL, {
  CircleLayerStyle,
  OnPressEvent,
} from "@react-native-mapbox-gl/maps";
import validateColor from "validate-color";

import ConfigContext from "../../context/ConfigContext";
import { ObservationsMap } from "../../context/ObservationsContext";

interface ObservationFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number] | [number, number, number];
  };
  properties: { id: string; categoryId?: string };
}

interface Props {
  observations: ObservationsMap;
  onPress: (event: OnPressEvent) => void;
}

const DEFAULT_MARKER_COLOR = "#F29D4B";

export const ObservationMapLayer = ({ observations, onPress }: Props) => {
  const [{ presets }] = React.useContext(ConfigContext);

  const featureCollection = {
    type: "FeatureCollection",
    features: mapObservationsToFeatures(observations),
  };

  const layerStyles: CircleLayerStyle = React.useMemo(() => {
    // Based on example implementation:
    // https://github.com/react-native-mapbox-gl/maps/blob/d6e7257e705b8e0be5d2d365a495c514b7f015f5/example/src/examples/SymbolCircleLayer/DataDrivenCircleColors.js
    const categoryColorPairs: string[] = [];

    presets.forEach(({ color }, id) => {
      if (color && validateColor(color)) {
        categoryColorPairs.push(id, color);
      }
    });

    return {
      circleColor:
        categoryColorPairs.length > 0
          ? [
              "match",
              ["get", "categoryId"],
              ...categoryColorPairs,
              DEFAULT_MARKER_COLOR,
            ]
          : DEFAULT_MARKER_COLOR,
      circleRadius: 5,
      circleStrokeColor: "#fff",
      circleStrokeWidth: 2,
    };
  }, [presets]);

  return (
    <MapboxGL.ShapeSource
      onPress={onPress}
      id="observations-source"
      shape={featureCollection}
    >
      <MapboxGL.CircleLayer id="circles" style={layerStyles} />
    </MapboxGL.ShapeSource>
  );
};

/**
 * Convert a map of observations into a GeoJSON FeatureCollection
 * Returns a GeoJSON FeatureCollection with Features that have the observation
 * location and id
 */
function mapObservationsToFeatures(
  obsMap: ObservationsMap
): ObservationFeature[] {
  const features: ObservationFeature[] = [];
  for (const obs of obsMap.values()) {
    // Only include observations with a location in the map view
    if (typeof obs.lon === "number" && typeof obs.lat === "number") {
      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [obs.lon, obs.lat],
        },
        properties: {
          id: obs.id,
          categoryId:
            obs.tags &&
            obs.tags.categoryId &&
            typeof obs.tags.categoryId === "string"
              ? obs.tags.categoryId
              : undefined,
        },
      });
    }
  }
  return features;
}
