import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { StyleSheet, View } from "react-native";
import { LIGHT_GREY } from "../lib/styles";
import Text from "./Text";

const m = defineMessages({
  lvlDetail: {
    id: "sharedComponent.OfflineAreaCard.lvlDetail",
    defaultMessage: "Level of Detail",
  },
  zoomLevel: {
    id: "sharedComponent.OfflineAreaCard.zoomLevel",
    defaultMessage: "Zoom Level",
  },
});

interface OfflineAreaCardProps {
  title: string;
  zoomLevel: number;
  lvlOfDetail?: string;
}

export const OfflineAreaCard = ({
  title,
  zoomLevel,
  lvlOfDetail,
}: OfflineAreaCardProps) => {
  return (
    <View style={[styles.container]}>
      <Text style={[styles.text, styles.title]}>{title}</Text>
      <Text style={[styles.text]}>
        <FormattedMessage {...m.zoomLevel} />: {zoomLevel.toString()}
      </Text>
      {!!lvlOfDetail && (
        <Text style={[styles.text]}>
          <FormattedMessage {...m.lvlDetail} />: {lvlOfDetail}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
  },
  text: {
    fontSize: 16,
  },
  title: {
    fontWeight: "bold",
  },
});
