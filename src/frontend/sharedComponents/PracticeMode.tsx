import * as React from "react";
import { useContext } from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { View, StyleSheet, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import ConfigContext from "../context/ConfigContext";
import { DARK_ORANGE, WHITE } from "../lib/styles";

const m = defineMessages({
  title: {
    id: "sharedComponents.PracticeMode.title",
    defaultMessage: "Practice Mode",
    description: "Indicated to user that they are on practice mode",
  },
});

interface PracticeModeProps {
  children: React.ReactNode;
  hideBar: boolean;
}

export const PracticeMode = ({ children, hideBar }: PracticeModeProps) => {
  const [config] = useContext(ConfigContext);

  // TODO change how we determine whether we are in practice mode or not
  const isDefaultConfig = config.metadata.name === "mapeo-default-settings";

  if (isDefaultConfig) {
    return (
      <View style={styles.container}>
        {children}

        {!hideBar && (
          <View style={styles.bottomBar}>
            <MaterialCommunityIcons
              name="lightbulb-on"
              color={WHITE}
              size={28}
            />
            <Text style={styles.text}>
              <FormattedMessage {...m.title} />
            </Text>
          </View>
        )}
      </View>
    );
  }

  //If practice mode is NOT enabled, the user is just returned the children
  return <React.Fragment>{children}</React.Fragment>;
};

const styles = StyleSheet.create({
  container: {
    borderColor: DARK_ORANGE,
    borderWidth: 5,
    flex: 1,
  },
  bottomBar: {
    backgroundColor: DARK_ORANGE,
    height: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 10,
  },
});
