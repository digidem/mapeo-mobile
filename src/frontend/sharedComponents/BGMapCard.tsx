import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapboxGL from "@react-native-mapbox-gl/maps";

import { LIGHT_GREY, MEDIUM_GREY } from "../lib/styles";
import { ViewStyleProp } from "../sharedTypes";
import { Pill } from "./Pill";
import LocationContext from "../context/LocationContext";
import { useNavigationFromRoot } from "../hooks/useNavigationWithTypes";

const m = defineMessages({
  currentMap: {
    id: "sharedComponents.BGMapCard.currentMap",
    defaultMessage: "Current Map",
  },
  abbrevMegabyte: {
    id: "sharedComponents.BGMapCard.abbrevMegabyte",
    defaultMessage: "MB",
    description: "The abbreviation for megabyte",
  },
  unamedStyle: {
    id: "sharedComponents.BGMapCard.unamedStyle",
    defaultMessage: "Unamed Style",
    description: "The name for the default map style",
  },
});

// ToDo: API calls to get styleURL, zoom level, center coordinate, etc.

interface BGMapCardProps {
  mapId: string;
  mapTitle?: string;
  style?: ViewStyleProp;
  styleUrl: string;
  onPress?: (() => void) | null;
  isSelected: boolean;
}

export const BGMapCard = ({
  mapTitle,
  style,
  isSelected,
  styleUrl,
  onPress,
  mapId,
}: BGMapCardProps) => {
  const { formatMessage: t } = useIntl();
  const { navigate } = useNavigationFromRoot();
  const { position } = React.useContext(LocationContext);

  const [zoomLevel, setZoomLevel] = React.useState<number>(6);

  function onPressDefault() {
    navigate("OfflineAreas", { mapId });
  }

  React.useEffect(() => {
    function getZoomLevel() {
      // To do: API call to get zoom level
      // This should be min zoom. Where is this coming from?
      return 6;
    }

    setZoomLevel(getZoomLevel());
  }, []);

  return (
    // To do. When deletion is supported, conver this to a TouchableOpacity
    // and make onPress={onPress || onPressDefault}
    <View
      style={[
        { borderColor: MEDIUM_GREY, borderWidth: 1, borderRadius: 2 },
        style,
      ]}
    >
      <View style={[styles.container]}>
        <MapboxGL.MapView
          styleURL={styleUrl}
          compassEnabled={false}
          zoomEnabled={false}
          logoEnabled={false}
          scrollEnabled={false}
          style={[styles.map]}
        >
          <MapboxGL.Camera
            zoomLevel={0}
            centerCoordinate={
              position
                ? [position?.coords.longitude, position?.coords.latitude]
                : [0, 0]
            }
            animationDuration={0}
            animationMode={"linearTo"}
            allowUpdates={true}
          />
        </MapboxGL.MapView>
        <View style={[styles.textContainer]}>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            {mapTitle || t(m.unamedStyle)}
          </Text>
          {isSelected && (
            <Pill containerStyle={{ marginTop: 10 }} text={m.currentMap} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: MEDIUM_GREY,
    borderWidth: 1,
    borderRadius: 2,
    flexDirection: "row",
    minHeight: 100,
  },
  textContainer: {
    padding: 10,
    backgroundColor: LIGHT_GREY,
    flex: 1,
  },
  text: {
    fontSize: 14,
  },
  map: {
    width: 84,
  },
});
