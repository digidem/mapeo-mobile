import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet, View, Text, GestureResponderEvent } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "react-navigation-hooks";
import { StackNavigationProp } from "react-navigation-stack/lib/typescript/src/vendor/types";
import { LIGHT_GREY, MEDIUM_GREY } from "../lib/styles";
import { ViewStyleProp } from "../sharedTypes";
import { Pill } from "./Pill";

const m = defineMessages({
  currentMap: {
    id: "sharedComponents.BGMapCard.currentMap",
    defaultMessage: "Current Map",
  },
  abbrevMegaBite: {
    id: "sharedComponents.BGMapCard.abbrevMegaBite",
    defaultMessage: "MB",
    description: "The abbreviation for mega bite",
  },
});

interface BGMapCardProps {
  mapId: string;
  mapTitle: string;
  mapSize: number;
  navigation: StackNavigationProp;
  style?: ViewStyleProp;
  onPress?: () => void | null;
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

  function onPressDefault() {
    navigate("OfflineAreas", { mapId });
  }

  return (
    <TouchableOpacity onPress={onPress || onPressDefault}>
      <View style={[styles.container, style]}>
        <View style={[styles.map]}></View>
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
