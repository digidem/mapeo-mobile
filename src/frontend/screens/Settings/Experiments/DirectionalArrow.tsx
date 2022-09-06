import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { LIGHT_GREY } from "../../../lib/styles";
import { useExperiments } from "../../../hooks/useExperiments";
import { NativeNavigationComponent } from "../../../sharedTypes";

const m = defineMessages({
  directionalArrow: {
    id: "screens.Settings.Experiments.DirectionalArrow.directionalArrow",
    defaultMessage: "Directional Arrow",
  },
  disclaimer: {
    id: "screens.Settings.Experiments.DirectionalArrow.disclaimer",
    defaultMessage:
      "The new Directional Arrow feature uses your smartphone's digital compass to provide information about which direction your phone is facing. Close proximity to large metal objects or strong magnetic field can affect the precision of the compass. If your smartphone doesn't have a compass, the Directional Arrow may still be able to determine direction based on movement. Direction based on movement may be less accurate.",
  },
  disclaimerNote: {
    id: "screens.Settings.Experiments.DirectionalArrow.disclaimerNote",
    defaultMessage:
      "NOTE: Directional Arrow is not reliable enough to be used exclusively for navigation, and it may drain your device battery faster.",
  },
  useArrow: {
    id: "screens.Settings.Experiments.DirectionalArrow.useArrow",
    defaultMessage: "Use Directional Arrow",
  },
});

export const DirectionalArrow: NativeNavigationComponent<"DirectionalArrow"> = () => {
  const [experiments, setExperiments] = useExperiments();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.header]}>
        <FormattedMessage {...m.directionalArrow} />
      </Text>
      <Text style={[{ marginBottom: 20 }, styles.text]}>
        <FormattedMessage {...m.disclaimer} />
      </Text>

      <Text style={[styles.text]}>
        <FormattedMessage {...m.disclaimerNote} />
      </Text>

      <View style={[styles.switchContainer]}>
        <Text style={[styles.text]}>
          <FormattedMessage {...m.useArrow} />
        </Text>

        <View
          onTouchStart={() => {
            setExperiments("directionalArrow", !experiments.directionalArrow);
          }}
        >
          <MaterialIcon
            name={
              experiments.directionalArrow
                ? "check-box"
                : "check-box-outline-blank"
            }
            size={24}
            color="rgba(0, 0, 0, 0.54)"
          />
        </View>
      </View>
    </ScrollView>
  );
};

DirectionalArrow.navTitle = m.directionalArrow;

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
