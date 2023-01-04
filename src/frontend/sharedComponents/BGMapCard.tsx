import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useNavigationFromRoot } from "../hooks/useNavigationWithTypes";
import { LIGHT_GREY, MEDIUM_GREY } from "../lib/styles";
import { ViewStyleProp } from "../sharedTypes";
import { Pill } from "./Pill";
import MapThumbnail from "./MapThumbnail";

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

interface BGMapCardProps {
  mapId: string;
  mapTitle: string | null;
  style?: ViewStyleProp;
  styleUrl: string;
  onPress?: (() => void) | null;
  isSelected: boolean;
  bytesStored?: number;
}

export const BGMapCard = ({
  mapTitle,
  style,
  isSelected,
  styleUrl,
  bytesStored,
  mapId,
}: BGMapCardProps) => {
  const { formatMessage: t } = useIntl();
  const { navigate } = useNavigationFromRoot();
  return (
    <TouchableOpacity
      style={[
        { borderColor: MEDIUM_GREY, borderWidth: 1, borderRadius: 2 },
        style,
      ]}
      onPress={() =>
        navigate("BackgroundMapInfo", {
          bytesStored,
          id: mapId,
          name: mapTitle || "",
          styleUrl,
        })
      }
    >
      <View style={[styles.container]}>
        <MapThumbnail styleUrl={styleUrl} style={styles.map} />
        <View style={[styles.textContainer]}>
          <Text style={[styles.text, { fontWeight: "bold" }]}>
            {mapTitle || t(m.unnamedStyle)}
          </Text>
          {isSelected && (
            <Pill containerStyle={{ marginTop: 10 }} text={m.currentMap} />
          )}
        </View>
      </View>
    </TouchableOpacity>
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
