import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import { useNavigationFromRoot } from "../../hooks/useNavigationWithTypes";
import Button from "../../sharedComponents/Button";

const m = defineMessages({
  title: {
    id: "screens.AppPasscode.NewPasscode.Splash.title",
    defaultMessage: "What is App Passcode?",
  },
  continue: {
    id: "screens.AppPasscode.NewPasscode.Splash.continue",
    defaultMessage: "Continue",
  },
  description: {
    id: "screens.AppPasscode.PasscodeIntro.description",
    defaultMessage:
      "App Passcode allows you to add an additional layer of security by requiring that you enter a passcode in order to open the Mapeo app. You can define your own 5-digit passcode by turning on the feature below.",
  },
  warning: {
    id: "screens.AppPasscode.PasscodeIntro.warning",
    defaultMessage:
      "**Please note that forgotten passcodes cannot be recovered!** Once this feature is enabled, if you forget or lose your passcode, you will not be able to open Mapeo and will lose access to any Mapeo data that has not been synced with other project participants.",
  },
});

export const PasscodeIntro = () => {
  const { formatMessage: t } = useIntl();
  const { navigate } = useNavigationFromRoot();

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Text style={[styles.title]}>{t(m.title)}</Text>
          <Text style={[styles.description]}>{t(m.description)}</Text>
          <Text style={[styles.description, { marginTop: 20 }]}>
            {t(m.warning)}
          </Text>
        </View>
        <View>
          <Button
            style={[styles.button]}
            onPress={() => navigate("SetPasscode")}
          >
            {t(m.continue)}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexBasis: "90%",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    textAlign: "center",
    paddingHorizontal: 30,
    marginBottom: 20,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    width: "100%",
    minWidth: 90,
    maxWidth: 280,
  },
});
