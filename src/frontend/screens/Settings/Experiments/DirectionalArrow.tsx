import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { StyleSheet, Text, View } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import SettingsContext from "../../../context/SettingsContext";
import { LIGHT_GREY } from "../../../lib/styles";
import HeaderTitle from "../../../sharedComponents/HeaderTitle";

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

export const DirectionalArrow: NavigationStackScreenComponent = () => {
  const [{ directionalArrow }, setSetting] = React.useContext(SettingsContext);

  return (
    <View style={[styles.container]}>
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
        <Text>
          <FormattedMessage {...m.useArrow} />
        </Text>

        <View
          onTouchEnd={() => {
            setSetting("directionalArrow", !directionalArrow);
          }}
        >
          <MaterialIcon
            name={directionalArrow ? "check-box" : "check-box-outline-blank"}
            size={24}
            color="rgba(0, 0, 0, 0.54)"
          />
        </View>
      </View>
    </View>
  );
};

DirectionalArrow.navigationOptions = {
  headerTitle: () => (
    <HeaderTitle>
      <FormattedMessage {...m.directionalArrow} />
    </HeaderTitle>
  ),
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
