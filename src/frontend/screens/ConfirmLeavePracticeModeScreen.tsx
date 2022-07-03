/**
 * Only reachable if the `onboarding` experiment is enabled
 * by doing either of the following:
 *   - Set `FEATURE_ONBOARDING=true` when running/building
 *   - Manually change the context value in `SettingsContext.tsx`
 */
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { FormattedMessage, defineMessages } from "react-intl";

import { MAGENTA, MAPEO_BLUE, WHITE } from "../lib/styles";
import Text from "../sharedComponents/Text";
import Button from "../sharedComponents/Button";

import { OptionRow } from "../sharedComponents/OptionRow";
import ObservationsContext from "../context/ObservationsContext";
import {
  AnimatedRadio,
  useAnimatedRadio,
} from "../sharedComponents/AnimatedRadio";
import { NativeRootNavigationProps } from "../sharedTypes";
import { useSetHeader } from "../hooks/useSetHeader";

type PersistenceOption = "keep" | "delete";

const m = defineMessages({
  leavePracticeMode: {
    id: "screens.ConfirmLeavePracticeModeScreen.leavePracticeMode",
    defaultMessage: "Leave Practice Mode",
  },
  deleteMyObservations: {
    id: "screens.ConfirmLeavePracticeModeScreen.deleteMyObservations",
    defaultMessage: "No, delete my observations",
  },
  keepMyObservations: {
    id: "screens.ConfirmLeavePracticeModeScreen.keepMyObservations",
    defaultMessage: "Yes, keep my observations",
  },
  keepObservationsQuestion: {
    id: "screens.ConfirmLeavePracticeModeScreen.keepObservationsQuestion",
    defaultMessage: `Bring ({observationCount}) {observationCount, plural, one {observation} other {observations}} from Practice Mode to the project?`,
  },
  cancel: {
    id: "screens.ConfirmLeavePracticeModeScreen.cancel",
    defaultMessage: "Cancel",
  },
  selectValidationError: {
    id: "screens.ConfirmLeavePracticeModeScreen.selectValidationError",
    defaultMessage: "Select one of the options",
  },
});

export const ConfirmLeavePracticeModeScreen = ({
  navigation,
  route,
}: NativeRootNavigationProps<"ConfirmLeavePracticeModeScreen">) => {
  const [selectedOption, setSelectedOption] = React.useState<
    PersistenceOption
  >();
  const [showError, setShowError] = React.useState(false);
  const {
    animate: animateRadio,
    animatedValue: animatedPulseValue,
  } = useAnimatedRadio();

  useSetHeader(m.leavePracticeMode);

  const [{ observations }] = React.useContext(ObservationsContext);

  const createPressHandler = (option: PersistenceOption) => () =>
    setSelectedOption(previous => (previous === option ? undefined : option));

  const createProject = () => {
    // TODO: do some project creation logic based on `selectedOption` value
    navigation.navigate("Home", { screen: "Map" });
  };

  const joinProject = () => {
    navigation.navigate("SyncOnboardingScreen", {
      keepExistingObservations: selectedOption === "keep",
    });
  };

  const onSubmit = () => {
    if (!selectedOption) {
      setShowError(true);
      animateRadio();
      return;
    }

    const projectAction = route.params.projectAction;

    projectAction === "join" ? joinProject() : createProject();
  };

  React.useEffect(() => {
    setShowError(false);
  }, [selectedOption]);

  return (
    <View style={styles.container}>
      <View>
        <View
          style={{
            paddingHorizontal: 20,
            marginVertical: 20,
          }}
        >
          <Text style={[styles.title, styles.centeredText]}>
            <FormattedMessage {...m.leavePracticeMode} />
          </Text>
          <Text style={[styles.description, styles.centeredText]}>
            <FormattedMessage
              {...m.keepObservationsQuestion}
              values={{ observationCount: observations.size }}
            />
          </Text>
        </View>
        <View style={styles.form}>
          <OptionRow onPress={createPressHandler("delete")}>
            <View style={styles.optionContentContainer}>
              <AnimatedRadio
                animatedValue={animatedPulseValue}
                selected={selectedOption === "delete"}
                showError={showError}
              />
              <Text style={styles.checkboxOptionText}>
                <FormattedMessage {...m.deleteMyObservations} />
              </Text>
            </View>
          </OptionRow>
          <OptionRow onPress={createPressHandler("keep")}>
            <View style={styles.optionContentContainer}>
              <AnimatedRadio
                animatedValue={animatedPulseValue}
                selected={selectedOption === "keep"}
                showError={showError}
              />
              <View>
                <Text style={styles.checkboxOptionText}>
                  <FormattedMessage {...m.keepMyObservations} />
                </Text>
              </View>
            </View>
          </OptionRow>
          {showError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                <FormattedMessage {...m.selectValidationError} />
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          fullWidth
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 20 }}
          variant="outlined"
        >
          <Text style={[styles.buttonText, { color: MAPEO_BLUE }]}>
            <FormattedMessage {...m.cancel} />
          </Text>
        </Button>
        <Button fullWidth onPress={onSubmit}>
          <Text style={[styles.buttonText, { color: WHITE }]}>
            <FormattedMessage {...m.leavePracticeMode} />
          </Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
  },
  form: {
    marginVertical: 20,
  },
  optionContentContainer: { flexDirection: "row" },
  title: {
    fontSize: 40,
    fontWeight: "700",
    marginBottom: 20,
  },
  description: { fontSize: 20 },
  checkboxOptionText: {
    fontSize: 20,
    paddingTop: 2,
    fontWeight: "700",
  },
  errorContainer: {
    paddingLeft: 32,
  },
  errorText: {
    color: MAGENTA,
    fontSize: 16,
    fontWeight: "700",
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  centeredText: {
    textAlign: "center",
  },
});
