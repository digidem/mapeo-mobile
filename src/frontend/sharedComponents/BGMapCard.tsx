import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet, View, Text } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";

import { LIGHT_GREY, MEDIUM_GREY } from "../lib/styles";
import { MapServerStyle, ViewStyleProp } from "../sharedTypes";
import { Pill } from "./Pill";
import LocationContext from "../context/LocationContext";
import { useEventSource } from "../hooks/useEventSource";
import api from "../api";

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
  unnamedStyle: {
    id: "sharedComponents.BGMapCard.unamedStyle",
    defaultMessage: "Unnamed Style",
    description: "The name for the default map style",
  },
});

// ToDo: API calls to get styleURL, zoom level, center coordinate, etc.

type BGMapCardProps = {
  style?: ViewStyleProp;
  onPress?: (() => void) | null;
  isSelected: boolean;
} & MapServerStyle;

export const BGMapCard = ({
  name,
  style,
  isSelected,
  url,
  id,
}: BGMapCardProps) => {
  const { formatMessage: t } = useIntl();
  const { position } = React.useContext(LocationContext);

  // We need to only open the event source if import isny completed
  //useEventSource(api.maps.getImportProgressUrl(id))

  return (
    <View
      style={[
        { borderColor: MEDIUM_GREY, borderWidth: 1, borderRadius: 2 },
        style,
      ]}
    >
      <View style={[styles.container]}>
        <MapboxGL.MapView
          styleURL={url}
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
            {name || t(m.unnamedStyle)}
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
