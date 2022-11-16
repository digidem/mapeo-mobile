import * as React from "react";
import { defineMessages } from "react-intl";
import { StyleSheet, View } from "react-native";
import { SecurityContext } from "../../context/SecurityContext";

import { WHITE } from "../../lib/styles";
import { NativeNavigationComponent } from "../../sharedTypes";
import { EnterPassToTurnOff } from "./EnterPassToTurnOff";

import { PasscodeIntro } from "./PasscodeIntro";
import { SetPassword } from "./SetPasscode";
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
  | "enterPasscode"
  | "disablePasscode";

export const AppPasscode: NativeNavigationComponent<"AppPasscode"> = ({
  navigation,
}) => {
  const { authValuesSet, authState } = React.useContext(SecurityContext);
  const [screenState, setScreenState] = React.useState<PasscodeScreens>(() =>
    authValuesSet.passcodeSet ? "enterPasscode" : "intro"
  );

  React.useEffect(() => {
    if (authState === "obscured") {
      navigation.navigate("Settings");
    }
  }, [navigation, authState]);

  const screen = React.useMemo(() => {
    if (screenState === "intro") {
      return <PasscodeIntro setScreen={setScreenState} />;
    }

    if (screenState === "setPasscode") {
      return <SetPassword setScreen={setScreenState} />;
    }

    if (screenState === "enterPasscode") {
      return <EnterPassToTurnOff setScreenState={setScreenState} />;
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
