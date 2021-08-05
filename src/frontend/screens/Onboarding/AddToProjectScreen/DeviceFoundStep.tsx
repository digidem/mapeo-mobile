import * as React from "react";
import { View, StyleSheet } from "react-native";
import { defineMessages, FormattedMessage } from "react-intl";

import Button from "../../../sharedComponents/Button";
import Text from "../../../sharedComponents/Text";
import { MAPEO_BLUE, WHITE } from "../../../lib/styles";

const m = defineMessages({
  title: {
    id: "screens.Onboarding.AddToProjectScreen.DeviceFoundStep.title",
    defaultMessage: "Device {deviceId} Found",
  },
  participantOptionDescription: {
    id:
      "screens.Onboarding.AddToProjectScreen.DeviceFoundStep.participantOptionDescription",
    defaultMessage: "This device is a Participant",
  },
  coordinatorOptionDescription: {
    id:
      "screens.Onboarding.AddToProjectScreen.DeviceFoundStep.coordinatorOptionDescription",
    defaultMessage: "This device is a Coordinator ",
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
  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.title, styles.centeredText]}>
          <FormattedMessage {...m.title} values={{ deviceId }} />
        </Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button variant="outlined" onPress={goBack} style={[styles.button]}>
          <Text style={[styles.buttonText, { color: MAPEO_BLUE }]}>
            <FormattedMessage {...m.cancel} />
          </Text>
        </Button>
        <View style={styles.spacer} />
        <Button onPress={goNext} style={styles.button}>
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
  title: {
    fontSize: 40,
    fontWeight: "bold",
  },
  description: {
    fontSize: 20,
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
    fontWeight: "bold",
  },
  spacer: {
    width: 20,
  },
});
