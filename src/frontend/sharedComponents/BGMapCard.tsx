import * as React from "react";
import { defineMessages } from "react-intl";
import { StyleSheet, View, Text } from "react-native";
import { MEDIUM_GREY } from "../lib/styles";
import { ViewStyleProp } from "../sharedTypes";
import { Pill } from "./Pill";

const m = defineMessages({
  currentMap: {
    id: "sharedComponents.BGMapCard.currentMap",
    defaultMessage: "Current Map",
  },
});

interface BGMapCardProps {
  mapTitle: string;
  mapSize: number;
  style?: ViewStyleProp;
}

export const BGMapCard = ({ mapSize, mapTitle, style }: BGMapCardProps) => {
  return (
    <View style={[style, styles.container]}>
      <View></View>
      <Text></Text>
      <Pill text={m.currentMap} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: MEDIUM_GREY,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 20,
  },
});
