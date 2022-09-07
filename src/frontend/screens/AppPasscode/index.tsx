import * as React from "react";
import { defineMessages } from "react-intl";
import { StyleSheet, View } from "react-native";

import { WHITE } from "../../lib/styles";
import { NativeNavigationComponent } from "../../sharedTypes";

import { InputPasscode } from "./InputPasscode";
import { PasscodeIntro } from "./PasscodeIntro";

const m = defineMessages({
  title: {
    id: "screens.AppPasscode",
    defaultMessage: "App Passcode",
  },
});

export type PasscodeScreens = "intro" | "setPasscode" | "confirmSetPasscode";

export const AppPasscode: NativeNavigationComponent<"AppPasscode"> = () => {
  const [screenState, setScreenState] = React.useState<PasscodeScreens>(
    "intro"
  );

  const screen = React.useMemo(() => {
    if (screenState === "intro") {
      return <PasscodeIntro setScreen={setScreenState} />;
    }

    return (
      <InputPasscode
        screenState={screenState}
        setScreenState={setScreenState}
      />
    );
  }, [screenState]);

  return <View style={styles.pageContainer}>{screen}</View>;
};

AppPasscode.navTitle = m.title;

const styles = StyleSheet.create({
  pageContainer: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: WHITE,
  },
});
