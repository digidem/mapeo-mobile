import * as React from "react";
import { defineMessages } from "react-intl";
import { StyleSheet, View } from "react-native";
import { SecurityContext } from "../../context/SecurityContext";

import { WHITE } from "../../lib/styles";
import { NativeNavigationComponent } from "../../sharedTypes";

import { InputPasscodeScreen } from "./InputPasscode";
import { PasscodeIntro } from "./PasscodeIntro";
import { TurnOffPasscode } from "./TurnOffPasscode";

const m = defineMessages({
  title: {
    id: "screens.AppPasscode",
    defaultMessage: "App Passcode",
  },
});

export type PasscodeScreens =
  | "intro"
  | "setPasscode"
  | "confirmSetPasscode"
  | "enterPasscode"
  | "disablePasscode";

export const AppPasscode: NativeNavigationComponent<"AppPasscode"> = () => {
  const { passcode } = React.useContext(SecurityContext);
  const [screenState, setScreenState] = React.useState<PasscodeScreens>(() =>
    !!passcode ? "enterPasscode" : "intro"
  );

  const screen = React.useMemo(() => {
    if (screenState === "intro") {
      return <PasscodeIntro setScreen={setScreenState} />;
    }

    if (
      screenState === "setPasscode" ||
      screenState === "confirmSetPasscode" ||
      screenState === "enterPasscode"
    ) {
      return (
        <InputPasscodeScreen
          screenState={screenState}
          setScreenState={setScreenState}
        />
      );
    }

    return <TurnOffPasscode setScreenState={setScreenState} />;
  }, [screenState]);

  return <View style={styles.pageContainer}>{screen}</View>;
};

AppPasscode.navTitle = m.title;

const styles = StyleSheet.create({
  pageContainer: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    flex: 1,
    backgroundColor: WHITE,
  },
});
