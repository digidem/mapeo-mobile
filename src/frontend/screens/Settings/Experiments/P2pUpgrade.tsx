import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { LIGHT_GREY, RED } from "../../../lib/styles";
import { useExperiments } from "../../../hooks/useExperiments";
import { NativeNavigationComponent } from "../../../sharedTypes";

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
  p2pWillBeDeprecated: {
    id: "screens.Settings.Experiments.P2pUpgrade.p2pWillBeDeprecated",
    defaultMessage:
      "Important: A new restriction by Google means that you can no longer update this app via P2P updates. However, activating this feature will still allow you to update older versions of Mapeo up to v5.6.0 on other phones. We are doing research on ways we can resolve this issue for future versions of Mapeo Mobile",
  },
});

export const P2pUpgrade: NativeNavigationComponent<"P2pUpgrade"> = () => {
  const [experiments, setExperiments] = useExperiments();
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

      <Text style={[styles.text, { marginTop: 20, color: RED }]}>
        <FormattedMessage {...m.p2pWillBeDeprecated} />
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

P2pUpgrade.navTitle = m.title;

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
    marginVertical: 20,
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
