import * as React from "react";
import { Animated, View, StyleSheet } from "react-native";
import { defineMessages, FormattedMessage } from "react-intl";
import CheckBox from "@react-native-community/checkbox";

import Button from "../../../sharedComponents/Button";
import Text from "../../../sharedComponents/Text";
import { TouchableWithoutFeedback } from "../../../sharedComponents/Touchables";
import { MAGENTA, MAPEO_BLUE, MEDIUM_BLUE, WHITE } from "../../../lib/styles";

type Role = "participant" | "coordinator";

const AnimatedCheckBox = Animated.createAnimatedComponent(CheckBox);

const m = defineMessages({
  title: {
    id: "screens.Onboarding.AddToProjectScreen.DeviceFoundStep.title",
    defaultMessage: "Device {deviceId} Found",
  },
  participantOptionTitle: {
    id:
      "screens.Onboarding.AddToProjectScreen.DeviceFoundStep.participantOptionTitle",
    defaultMessage: "This device is a Participant",
  },
  coordinatorOptionTitle: {
    id:
      "screens.Onboarding.AddToProjectScreen.DeviceFoundStep.coordinatorOptionTitle",
    defaultMessage: "This device is a Coordinator",
  },
  coordinatorOptionDescription: {
    id:
      "screens.Onboarding.AddToProjectScreen.DeviceFoundStep.coordinatorOptionDescription",
    defaultMessage: "Coordinators can add and remove devices from projects",
  },
  selectValidationError: {
    id:
      "screens.Onboarding.AddToProjectScreen.DeviceFoundStep.selectValidationError",
    defaultMessage: "Select a role for the device",
  },
  cancel: {
    id: "screens.Onboarding.AddToProjectScreen.DeviceFoundStep.cancel",
    defaultMessage: "Cancel",
  },
  inviteDevice: {
    id: "screens.Onboarding.AddToProjectScreen.inviteDevice",
    defaultMessage: "Invite Device",
  },
});

interface Props {
  deviceId: string;
  goBack: () => void;
  goNext: () => void;
}

export const DeviceFoundStep = ({ deviceId, goBack, goNext }: Props) => {
  const [selectedRole, setSelectedRole] = React.useState<Role>();
  const [showError, setShowError] = React.useState(false);
  const pulseAnimationValue = React.useRef(new Animated.Value(0)).current;

  const animatedCheckBoxStyles = React.useMemo(
    () => ({
      transform: [
        {
          scale: pulseAnimationValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1.2, 1.5, 1.2],
          }),
        },
      ],
    }),
    []
  );

  const createRoleOption = (role: Role) => (
    <AnimatedCheckBox
      onValueChange={createOptionHandler(role)}
      style={animatedCheckBoxStyles}
      tintColors={{ false: showError ? MAGENTA : undefined, true: MEDIUM_BLUE }}
      value={selectedRole === role}
    />
  );

  const createOptionHandler = (role: Role) => (selected: boolean) =>
    setSelectedRole(selected ? role : undefined);

  const createTextPressHandler = (role: Role) => () =>
    setSelectedRole(previous => (previous === role ? undefined : role));

  const onSubmit = () => {
    if (selectedRole) {
      goNext();
    } else {
      setShowError(true);
      Animated.timing(pulseAnimationValue, {
        toValue: 1,
        useNativeDriver: true,
        duration: 500,
      }).start(() => {
        pulseAnimationValue.setValue(0);
      });
    }
  };

  React.useEffect(() => {
    setShowError(false);
  }, [selectedRole]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.title, styles.centeredText]}>
          <FormattedMessage {...m.title} values={{ deviceId }} />
        </Text>
        <View style={styles.form}>
          <View style={styles.optionContainer}>
            {createRoleOption("participant")}
            <View style={styles.pressableTextContainer}>
              <TouchableWithoutFeedback
                onPress={createTextPressHandler("participant")}
              >
                <Text style={[styles.checkboxOptionTitle, styles.bold]}>
                  <FormattedMessage {...m.participantOptionTitle} />
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={styles.optionContainer}>
            {createRoleOption("coordinator")}
            <View style={styles.pressableTextContainer}>
              <TouchableWithoutFeedback
                onPress={createTextPressHandler("coordinator")}
              >
                <Text style={[styles.checkboxOptionTitle, styles.bold]}>
                  <FormattedMessage {...m.coordinatorOptionTitle} />
                </Text>
                <Text style={styles.checkboxOptionDescription}>
                  <FormattedMessage {...m.coordinatorOptionDescription} />
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
          {showError && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, styles.bold]}>
                <FormattedMessage {...m.selectValidationError} />
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Button variant="outlined" onPress={goBack} style={[styles.button]}>
          <Text style={[styles.buttonText, styles.bold, { color: MAPEO_BLUE }]}>
            <FormattedMessage {...m.cancel} />
          </Text>
        </Button>
        <View style={styles.spacer} />
        <Button onPress={onSubmit} style={styles.button}>
          <Text style={[styles.buttonText, styles.bold, { color: WHITE }]}>
            <FormattedMessage {...m.inviteDevice} />
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
    paddingVertical: 20,
  },
  form: {
    marginVertical: 20,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  pressableTextContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  checkboxOptionTitle: {
    fontSize: 20,
    paddingTop: 2,
  },
  checkboxOptionDescription: {
    fontSize: 16,
  },
  errorContainer: {
    paddingLeft: 40,
  },
  errorText: {
    color: MAGENTA,
    fontSize: 16,
  },
  centeredText: {
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
  },
  spacer: {
    width: 20,
  },
});
