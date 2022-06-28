/**
 * Only reachable if the `onboarding` experiment is enabled
 * by doing either of the following:
 *   - Set `FEATURE_ONBOARDING=true` when running/building
 *   - Manually change the context value in `SettingsContext.tsx`
 */
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { FormattedMessage, defineMessages } from "react-intl";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import ObservationsContext from "../../../context/ObservationsContext";
import Text from "../../../sharedComponents/Text";
import Button from "../../../sharedComponents/Button";
import { MAPEO_BLUE } from "../../../lib/styles";
import { useNavigation } from "../../../hooks/useNavigationWithTypes";

const m = defineMessages({
  leavePracticeMode: {
    id: "screens.Settings.ProjectConfig.LeavePracticeMode.leavePracticeMode",
    defaultMessage: "Ready to leave Practice Mode?",
  },
  createOrJoinProject: {
    id: "screens.Settings.ProjectConfig.LeavePracticeMode.createOrJoinProject",
    defaultMessage: "Create or join a project below",
  },
  createProject: {
    id: "screens.Settings.ProjectConfig.LeavePracticeMode.createProject",
    defaultMessage: "Create a Project",
  },
  joinProject: {
    id: "screens.Settings.ProjectConfig.LeavePracticeMode.joinProject",
    defaultMessage: "Join a Project",
  },
});

export const LeavePracticeMode = () => {
  const navigation = useNavigation();
  const [{ observations }] = React.useContext(ObservationsContext);

  const createProject = () => {
    if (observations.size > 0) {
      navigation.navigate("ConfirmLeavePracticeModeScreen", {
        projectAction: "create",
      });
    } else {
      navigation.navigate("CreateProjectScreen");
    }
  };

  const joinProject = () =>
    navigation.navigate("JoinProjectQrScreen", { isAdmin: false });

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.title, styles.centered, styles.bold]}>
          <FormattedMessage {...m.leavePracticeMode} />
        </Text>
        <Text style={[styles.text, styles.centered]}>
          <FormattedMessage {...m.createOrJoinProject} />
        </Text>
      </View>
      <View style={styles.iconContainer}>
        <MaterialIcon name="arrow-downward" size={40} />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          fullWidth
          onPress={createProject}
          style={{ marginBottom: 20 }}
          variant="outlined"
        >
          <Text style={[styles.text, styles.buttonText, styles.bold]}>
            <FormattedMessage {...m.createProject} />
          </Text>
        </Button>
        <Button fullWidth onPress={joinProject} variant="outlined">
          <Text style={[styles.text, styles.buttonText, styles.bold]}>
            <FormattedMessage {...m.joinProject} />
          </Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  title: {
    fontSize: 20,
  },
  iconContainer: {
    alignItems: "center",
    margin: 15,
  },
  text: { fontSize: 18 },
  bold: { fontWeight: "700" },
  centered: {
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  buttonText: {
    color: MAPEO_BLUE,
  },
});
