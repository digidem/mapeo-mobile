import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { LIGHT_GREY } from "../../../lib/styles";
import { useExperiments } from "../../../hooks/useExperiments";
import { useSetHeader } from "../../../hooks/useSetHeader";

const m = defineMessages({
  title: {
    id: "screens.Settings.Experiments.P2pUpgrade.title",
    defaultMessage: "P2P App Updates",
  },
  warning: {
    id: "screens.Settings.Experiments.P2pUpgrade.warning",
    defaultMessage:
      "Peer-to-peer (P2P) App Updates allows you to share and receive newer versions of the Mapeo app by connecting to other Mapeo devices via Wi-Fi (no internet connection required). To use this feature, the Mapeo Synchronize screen must be open on both devices.",
  },
  warningSubheader: {
    id: "screens.Settings.Experiments.P2pUpgrade.warningSubheader",
    defaultMessage:
      "NOTE: When updating the Mapeo app version in this way, NONE of your Mapeo data (observations, configurations, or maps) is shared between devices.",
  },
  useP2p: {
    id: "screens.Settings.Experiments.P2pUpgrade.useP2p",
    defaultMessage: "Use P2P App Updater",
  },
});

export const P2pUpgrade = () => {
  const [experiments, setExperiments] = useExperiments();
  useSetHeader({ headerTitle: m.title });
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.header]}>
        <FormattedMessage {...m.title} />
      </Text>
      <Text style={[styles.text]}>
        <FormattedMessage {...m.warning} />
      </Text>

      <Text style={[{ marginTop: 20 }, styles.text]}>
        <FormattedMessage {...m.warningSubheader} />
      </Text>

      <View style={[styles.switchContainer]}>
        <Text style={[styles.text]}>
          <FormattedMessage {...m.useP2p} />
        </Text>

        <View
          onTouchStart={() => {
            setExperiments("p2pUpgrade", !experiments.p2pUpgrade);
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
    </ScrollView>
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
  text: {
    fontSize: 16,
  },
});
