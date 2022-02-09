import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { StyleSheet, Text, View } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import SettingsContext from "../../../context/SettingsContext";
import { LIGHT_GREY } from "../../../lib/styles";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

const m = defineMessages({
  title: {
    id: "screens.Settings.Experiments.P2pUpgrade.title",
    defaultMessage: "P2P Upgrade",
  },
  warning: {
    id: "screens.Settings.Experiments.P2pUpgrade.warning",
    defaultMessage:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  useP2p: {
    id: "screens.Settings.Experiments.P2pUpgrade.useP2p",
    defaultMessage: "Use p2p upgrader",
  },
});

export const P2pUpgrade: NavigationStackScreenComponent = () => {
  const [{ experiments }, setSettings] = React.useContext(SettingsContext);
  return (
    <View style={[styles.container]}>
      <Text style={[styles.header]}>
        <FormattedMessage {...m.title} />
      </Text>
      <Text>
        <FormattedMessage {...m.warning} />
      </Text>

      <View style={[styles.switchContainer]}>
        <Text>
          <FormattedMessage {...m.useP2p} />
        </Text>

        <View
          onTouchEnd={() => {
            setSettings("experiments", {
              ...experiments,
              p2pUpgrade: !experiments.p2pUpgrade,
            });
          }}
        >
          <MaterialIcon
            name={
              experiments.p2pUpgrade ? "check-box" : "check-box-outline-blank"
            }
            size={24}
            color="rgba(0, 0, 0, 0.54)"
          />
        </View>
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
