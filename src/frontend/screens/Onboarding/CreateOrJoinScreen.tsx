/**
 * Only reachable if the `onboarding` experiment is enabled
 * by doing either of the following:
 *   - Set `FEATURE_ONBOARDING=true` when running/building
 *   - Manually change the context value in `SettingsContext.tsx`
 */
import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "react-navigation-hooks";
import { FormattedMessage, defineMessages } from "react-intl";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { BLACK, MAPEO_BLUE, WHITE } from "../../lib/styles";
import { showWipAlert } from "../../lib/utils";
import Button from "../../sharedComponents/Button";

const m = defineMessages({
  createProject: {
    id: "screens.Onboarding.CreateOrJoinProjectScreen.createProject",
    defaultMessage: "Create a Project",
  },
  joinProject: {
    id: "screens.Onboarding.CreateOrJoinProjectScreen.joinProject",
    defaultMessage: "Join a Project",
  },
  practiceMode: {
    id: "screens.Onboarding.CreateOrJoinProjectScreen.praceticeMode",
    defaultMessage: "Practice Mode",
  },
  joinCta: {
    id: "screens.Onboarding.CreateOrJoinProjectScreen.joinCta",
    defaultMessage: "Tap here to {action}",
  },
});

export const CreateOrJoinScreen: NavigationStackScreenComponent = () => {
  const { navigate } = useNavigation();

  return (
    <View style={styles.pageContainer}>
      <View style={styles.primaryActionsContainer}>
        <View style={styles.logoContainer}>
          <Image source={require("../../images/icon_mapeo_pin.png")} />
        </View>

        <Text style={styles.title}>Mapeo</Text>
        <Button
          fullWidth
          onPress={() => navigate("CreateProject")}
          style={styles.button}
        >
          <Text style={[styles.buttonText, { color: WHITE }]}>
            <FormattedMessage {...m.createProject} />
          </Text>
        </Button>
        <Button
          fullWidth
          onPress={showWipAlert}
          style={styles.button}
          variant="outlined"
        >
          <View style={styles.practiceModeContentContainer}>
            <View style={styles.lightBulbIconContainer}>
              <MaterialIcon
                name="wb-incandescent"
                color={MAPEO_BLUE}
                size={22}
                style={styles.lightBulbIcon}
              />
            </View>
            <Text style={[styles.buttonText, { color: MAPEO_BLUE }]}>
              <FormattedMessage {...m.practiceMode} />
            </Text>
          </View>
        </Button>
      </View>
      <Button onPress={() => navigate("JoinProjectQr")} variant="text">
        <Text style={[styles.buttonText, { color: BLACK }]}>
          <FormattedMessage
            {...m.joinCta}
            values={{
              action: (
                <Text style={{ color: MAPEO_BLUE }}>
                  <FormattedMessage {...m.joinProject} />
                </Text>
              ),
            }}
          />
        </Text>
      </Button>
    </View>
  );
};

CreateOrJoinScreen.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    padding: 40,
  },
  primaryActionsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "700",
  },
  button: {
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  practiceModeContentContainer: {
    flexDirection: "row",
  },
  lightBulbIconContainer: {
    marginRight: 10,
  },
  lightBulbIcon: {
    transform: [{ rotate: "180deg" }],
  },
});
