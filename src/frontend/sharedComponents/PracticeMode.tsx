import * as React from "react";
import { useContext } from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { View, StyleSheet, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import ConfigContext from "../context/ConfigContext";
import { SecurityContext } from "../context/SecurityContext";
import { DARK_ORANGE, MEDIUM_BLUE, WHITE } from "../lib/styles";
import { isInPracticeMode } from "../lib/utils";

const m = defineMessages({
  title: {
    id: "sharedComponents.PracticeMode.title",
    defaultMessage: "Practice Mode",
    description: "Indicated to user that they are on practice mode",
  },
  welcomeMode: {
    id: "sharedComponents.PracticeMode.welcomeMode",
    defaultMessage: "Welcome Mode",
    description:
      "Indicated to user that they are on Kill/Welcome Mode (No observations will be shown)",
  },
});

interface PracticeModeProps {
  children: React.ReactNode;
  enabled: boolean;
  hideBar: boolean;
}

export const PracticeMode = ({
  children,
  enabled,
  hideBar,
}: PracticeModeProps) => {
  const [config] = useContext(ConfigContext);
  const [{ appMode }] = useContext(SecurityContext);

  const showPracticeModeUi = enabled && isInPracticeMode(config);

  const killState = React.useMemo(() => {
    return appMode === "kill";
  }, [appMode]);

  return (
    <View
      style={[
        styles.flexContainer,
        showPracticeModeUi && styles.practiceModeContainer,
        killState && styles.welcomeMode,
        { backgroundColor: "#FFF" },
      ]}
    >
      <View style={styles.flexContainer}>{children}</View>

      {showPracticeModeUi && !hideBar && (
        <View style={[styles.bottomBar, killState && styles.welcomeMode]}>
          {!killState && (
            <MaterialCommunityIcons
              name="lightbulb-on"
              color={WHITE}
              size={28}
            />
          )}
          <Text style={styles.text}>
            {!killState ? (
              <FormattedMessage {...m.title} />
            ) : (
              <FormattedMessage {...m.welcomeMode} />
            )}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  practiceModeContainer: {
    borderColor: DARK_ORANGE,
    borderWidth: 5,
  },
  bottomBar: {
    backgroundColor: DARK_ORANGE,
    height: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeMode: {
    backgroundColor: MEDIUM_BLUE,
    borderColor: MEDIUM_BLUE,
  },
  text: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 10,
  },
});
