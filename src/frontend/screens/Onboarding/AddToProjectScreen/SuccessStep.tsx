import * as React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { defineMessages, FormattedMessage } from "react-intl";
import Text from "../../../sharedComponents/Text";
import Button from "../../../sharedComponents/Button";
import { WHITE } from "../../../lib/styles";

const m = defineMessages({
  title: {
    id: "screens.Onboarding.AddToProjectScreen.SuccessStep.title",
    defaultMessage: "Success!",
  },
  description: {
    id: "screens.Onboarding.AddToProjectScreen.SuccessStep.description",
    defaultMessage: "{deviceId} has been added to {projectName}",
  },
  goToSync: {
    id: "screens.Onboarding.AddToProjectScreen.SuccessStep.goToSync",
    defaultMessage: "Go To Sync",
  },
});

interface Props {
  deviceId: string;
  goNext: () => void;
  projectName: string;
}

export const SuccessStep = ({ deviceId, goNext, projectName }: Props) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.title, styles.centeredText]}>
          <FormattedMessage {...m.title} />
        </Text>
        <Text style={[styles.description, styles.centeredText]}>
          <FormattedMessage
            {...m.description}
            values={{ deviceId, projectName }}
          />
        </Text>
      </View>
      <Button onPress={goNext}>
        <Text style={[styles.buttonText, { color: WHITE }]}>
          <FormattedMessage {...m.goToSync} />
        </Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  // AddToProjectScreen
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
    marginVertical: 20,
  },
  centeredText: {
    textAlign: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
