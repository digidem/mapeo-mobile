import * as React from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";

import riversSource from "mapeo-offline-map/dist/rivers.json";
import boundariesSource from "mapeo-offline-map/dist/boundaries.json";
import lakesSource from "mapeo-offline-map/dist/lakes.json";
import landSource from "mapeo-offline-map/dist/land.json";
import graticuleSource from "mapeo-offline-map/dist/graticule.json";

export const OfflineMapLayers = React.memo(() => (
  <>
    <MapboxGL.ShapeSource id="rivers-source" shape={riversSource} />
    <MapboxGL.ShapeSource id="boundaries-source" shape={boundariesSource} />
    <MapboxGL.ShapeSource id="lakes-source" shape={lakesSource} />
    <MapboxGL.ShapeSource id="land-source" shape={landSource} />
    <MapboxGL.ShapeSource id="graticule-source" shape={graticuleSource} />
  </>
));
