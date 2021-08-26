import * as React from "react";
import { Animated, View, StyleSheet } from "react-native";
import { defineMessages, FormattedMessage } from "react-intl";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import {
  MEDIUM_GREY,
  MAGENTA,
  MAPEO_BLUE,
  MEDIUM_BLUE,
  WHITE,
} from "../../../lib/styles";
import Button from "../../../sharedComponents/Button";
import Text from "../../../sharedComponents/Text";
import { OptionRow } from "./OptionRow";

type Role = "participant" | "coordinator";

const m = defineMessages({
  title: {
    id: "screens.AddToProjectScreen.DeviceFoundStep.title",
    defaultMessage: "Device {deviceId} Found",
  },
  participantOptionTitle: {
    id: "screens.AddToProjectScreen.DeviceFoundStep.participantOptionTitle",
    defaultMessage: "This device is a Participant",
  },
  coordinatorOptionTitle: {
    id: "screens.AddToProjectScreen.DeviceFoundStep.coordinatorOptionTitle",
    defaultMessage: "This device is a Coordinator",
  },
  coordinatorOptionDescription: {
    id:
      "screens.AddToProjectScreen.DeviceFoundStep.coordinatorOptionDescription",
    defaultMessage: "Coordinators can add and remove devices from projects",
  },
  selectValidationError: {
    id: "screens.AddToProjectScreen.DeviceFoundStep.selectValidationError",
    defaultMessage: "Select a role for the device",
  },
  cancel: {
    id: "screens.AddToProjectScreen.DeviceFoundStep.cancel",
    defaultMessage: "Cancel",
  },
  inviteDevice: {
    id: "screens.AddToProjectScreen.inviteDevice",
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

  const animatedRadioStyles = React.useMemo(
    () => ({
      margin: 4,
      transform: [
        {
          scale: pulseAnimationValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1.2, 1],
          }),
        },
      ],
    }),
    []
  );

  const createAnimatedRadio = (role: Role) => {
    const selected = selectedRole === role;
    return (
      <Animated.View style={animatedRadioStyles}>
        <MaterialIcon
          name={selected ? "radio-button-checked" : "radio-button-unchecked"}
          size={24}
          color={showError ? MAGENTA : selected ? MEDIUM_BLUE : MEDIUM_GREY}
        />
      </Animated.View>
    );
  };

  const createPressHandler = (role: Role) => () =>
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
          <OptionRow onPress={createPressHandler("participant")}>
            <View style={styles.optionContentContainer}>
              {createAnimatedRadio("participant")}
              <Text style={[styles.checkboxOptionTitle, styles.bold]}>
                <FormattedMessage {...m.participantOptionTitle} />
              </Text>
            </View>
          </OptionRow>
          <OptionRow onPress={createPressHandler("coordinator")}>
            <View style={styles.optionContentContainer}>
              {createAnimatedRadio("coordinator")}
              <View>
                <Text style={[styles.checkboxOptionTitle, styles.bold]}>
                  <FormattedMessage {...m.coordinatorOptionTitle} />
                </Text>
                <Text style={styles.checkboxOptionDescription}>
                  <FormattedMessage {...m.coordinatorOptionDescription} />
                </Text>
              </View>
            </View>
          </OptionRow>
          {showError && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, styles.bold]}>
                <FormattedMessage {...m.selectValidationError} />
              </Text>
            </View>
          )}
        </View>
      </View>
      <View>
        <Button
          fullWidth
          onPress={goBack}
          style={{ marginBottom: 12 }}
          variant="outlined"
        >
          <Text style={[styles.buttonText, { color: MAPEO_BLUE }]}>
            <FormattedMessage {...m.cancel} />
          </Text>
        </Button>
        <Button fullWidth onPress={onSubmit}>
          <Text style={[styles.buttonText, { color: WHITE }]}>
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
  optionContentContainer: { flexDirection: "row" },
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
    paddingLeft: 32,
  },
  errorText: {
    color: MAGENTA,
    fontSize: 16,
  },
  centeredText: {
    textAlign: "center",
  },
  buttonText: {
    fontSize: 16,
  },
  bold: {
    fontWeight: "bold",
  },
});
