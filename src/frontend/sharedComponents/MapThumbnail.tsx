import MapboxGL from "@react-native-mapbox-gl/maps";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import LocationContext from "../context/LocationContext";

const defaultStyle = {
  width: 80,
  height: 80,
};

/**
 * Non-interactive map thumbnail — to be replaced by static images once we
 * support that with the map server
 */
export default function MapThumbnail({
  styleUrl,
  style = defaultStyle,
}: {
  styleUrl: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { position } = React.useContext(LocationContext);

  // TODO: need a background image that shows if the map does not load (e.g. if
  // the user is offline and the map is not available offline)

  return (
    <MapboxGL.MapView
      compassEnabled={false}
      zoomEnabled={false}
      logoEnabled={false}
      scrollEnabled={false}
      styleURL={styleUrl}
      style={style}
    >
      <MapboxGL.Camera
        animationDuration={0}
        animationMode="linearTo"
        centerCoordinate={
          position
            ? [position.coords.longitude, position.coords.latitude]
            : [0, 0]
        }
        allowUpdates
      />
    </MapboxGL.MapView>
  );
}
