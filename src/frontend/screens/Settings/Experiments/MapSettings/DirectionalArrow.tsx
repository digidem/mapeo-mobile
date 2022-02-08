import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { StyleSheet, Switch, Text, View } from "react-native";
import SettingsContext from "../../../../context/SettingsContext";
import { LIGHT_GREY } from "../../../../lib/styles";

const m = defineMessages({
  directionalArrow: {
    id:
      "screens.Settings.Experiments.MapSettings.DirectionalArrow.directionalArrow",
    defaultMessage: "Directional Arrow",
  },
  disclaimer: {
    id: "screens.Settings.Experiments.MapSettings.DirectionalArrow.disclaimer",
    defaultMessage:
      "The new Directional Arrow is a feature that uses magnetometer and falls back to accelerometer on your smartphone to determine the direction a user is facing. For best use: Be outside away from objects. Walk forward as this helps devices establish a direction. If your device does not have a gyroscope (internal compass) accuracy of the arrow can be misleading.This feature should not be used exclusively for navigation. Accompany use with a compass or dedicated GPS device. Expect battery to drain faster. Arrow may move with some delay when changing direction",
  },
  useArrow: {
    id: "screens.Settings.Experiments.MapSettings.DirectionalArrow.useArrow",
    defaultMessage: "Use Directional Arrow",
  },
});

export const DirectionalArrow = () => {
  const [{ directionalArrow }, setSetting] = React.useContext(SettingsContext);

  return (
    <View style={[styles.container]}>
      <Text style={[styles.header]}>
        <FormattedMessage {...m.directionalArrow} />
      </Text>
      <Text>
        <FormattedMessage {...m.disclaimer} />
      </Text>

      <View style={[styles.switchContainer]}>
        <Text>
          <FormattedMessage {...m.useArrow} />
        </Text>
        <Switch
          trackColor={{ false: LIGHT_GREY, true: LIGHT_GREY }}
          onChange={() => {
            setSetting("directionalArrow", !directionalArrow);
          }}
          value={directionalArrow}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    marginTop: 40,
    marginBottom: 20,
  },
  switchContainer: {
    marginTop: 20,
    paddingVertical: 20,
    borderColor: LIGHT_GREY,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
