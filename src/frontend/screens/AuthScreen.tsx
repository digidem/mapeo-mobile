import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { View, Image, Text, StyleSheet } from "react-native";

import { DARK_BLUE, RED, WHITE } from "../lib/styles";
import { OBSCURE_PASSCODE } from "../constants";
import { SecurityContext } from "../context/SecurityContext";
import { PasscodeInput } from "../sharedComponents/PasscodeInput";
import useSettingsValue from "../hooks/useSettingsValue";

const m = defineMessages({
  enterPass: {
    id: "screens.EnterPassword.enterPass",
    defaultMessage: "Enter your passcode",
  },
  wrongPass: {
    id: "screens.EnterPassword.wrongPass",
    defaultMessage: "Incorrect passcode, please try again ",
  },
});

export const AuthScreen = () => {
  const [error, setError] = React.useState(false);
  const { setAuthState, passcode } = React.useContext(SecurityContext);
  const [inputtedPass, setInputtedPass] = React.useState("");
  const obscureModeEnabled = useSettingsValue("obscurityPassEnabled");

  React.useEffect(() => {
    if (error) setError(false);
    if (inputtedPass.length === 5) {
      validatePass(inputtedPass);
    }
  }, [inputtedPass]);

  function validatePass(inputtedPass: string) {
    if (inputtedPass === OBSCURE_PASSCODE && obscureModeEnabled) {
      setAuthState("obscured");
      return;
    }

    if (inputtedPass === passcode) {
      setAuthState("authenticated");
      return;
    }

    setError(true);
  }

  return (
    <View style={[styles.container]}>
      <Image source={require("../images/icon_mapeo_pin.png")} />
      <Text style={[styles.title]}>Mapeo</Text>

      <Text style={[{ marginBottom: 20, fontSize: 16 }]}>
        <FormattedMessage {...m.enterPass} />
      </Text>

      <PasscodeInput
        inputValue={inputtedPass}
        onChangeTextWithValidation={setInputtedPass}
      />

      {error && (
        <Text style={[styles.wrongPass]}>
          <FormattedMessage {...m.wrongPass} />
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    alignItems: "center",
    paddingTop: 40,
    flex: 1,
    backgroundColor: WHITE,
  },
  title: {
    fontSize: 52.5,
    color: DARK_BLUE,
    fontWeight: "500",
    marginBottom: 40,
  },
  wrongPass: {
    fontSize: 16,
    marginTop: 20,
    color: RED,
  },
});
