import * as React from "react";
import { FormattedMessage, defineMessages } from "react-intl";
import { View } from "react-native";

const m = defineMessages({
  title: {
    id: "screens.AppPasscode.NewPasscode.Splash",
    defaultMessage: "What is App Passcode?",
  },
});

export const SplashScreen = () => {
  return <FormattedMessage {...m.title} />;
};
