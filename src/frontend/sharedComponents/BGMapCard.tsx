import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { StackNavigationProp } from "react-navigation-stack/lib/typescript/src/vendor/types";

import { LIGHT_GREY, MEDIUM_GREY } from "../lib/styles";
import { ViewStyleProp } from "../sharedTypes";
import { Pill } from "./Pill";
import LocationContext from "../context/LocationContext";

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
});

//ToDo: API calls to get styleURL, zoom level, center coordinate, etc.

interface BGMapCardProps {
  mapId: string;
  mapTitle: string;
  mapSize: number;
  navigation: StackNavigationProp;
  style?: ViewStyleProp;
  onPress?: (() => void) | null;
}

export const BGMapCard = ({
  mapSize,
  mapTitle,
  style,
  onPress,
  mapId,
  navigation,
}: BGMapCardProps) => {
  const { formatMessage: t } = useIntl();
  const { navigate } = navigation;
  const { position } = React.useContext(LocationContext);
  const [styleUrl, setStyleUrl] = React.useState<string>(
    "mapbox://styles/mapbox/streets-v11"
  );
  const [zoomLevel, setZoomLevel] = React.useState<number>(6);
  const [centerCoordinate, setCenterCoordinate] = React.useState<
    (number | undefined)[]
  >([position?.coords.longitude, position?.coords.latitude]);

  function onPressDefault() {
    navigate("OfflineAreas", { mapId });
  }

  React.useEffect(() => {
    function getStyleURL() {
      //To do: API call to get styleURL
      return "mapbox://styles/mapbox/streets-v11";
    }
    function getZoomLevel() {
      //To do: API call to get zoom level
      //This should be min zoom. Where is this coming from?
      return 6;
    }
    function getCenterCoordinate() {
      //To do: API call to get center coordinate
      //I believe this should come from the styleJSON `center` property
      return [position?.coords.longitude, position?.coords.latitude];
    }

    setStyleUrl(getStyleURL());
    setZoomLevel(getZoomLevel());
    setCenterCoordinate(getCenterCoordinate());
  }, []);

  return (
    <TouchableOpacity onPress={onPress || onPressDefault}>
      <View style={[styles.container, style]}>
        <MapboxGL.MapView
          // placeholder style URL
          styleURL={styleUrl}
          compassEnabled={false}
          zoomEnabled={false}
          logoEnabled={false}
          scrollEnabled={false}
          style={[styles.map]}
        >
          <MapboxGL.Camera
            zoomLevel={zoomLevel}
            centerCoordinate={centerCoordinate}
          />
        </MapboxGL.MapView>
        <View style={[styles.textContainer]}>
          <Text style={[styles.text, { fontWeight: "bold" }]}>{mapTitle}</Text>
          <Text style={[styles.text]}>
            {mapSize.toString() + t(m.abbrevMegaBite)}
          </Text>
          <Pill containerStyle={{ marginTop: 10 }} text={m.currentMap} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: MEDIUM_GREY,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
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
