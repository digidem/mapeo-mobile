import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { View, Image, Text, StyleSheet } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { DARK_BLUE, DARK_GREY, MEDIUM_GREY, WARNING_RED } from "../lib/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { KILL_PASSCODE, PASSWORD_KEY } from "../constants";
import { AuthState, SecurityContext } from "../context/SecurityContext";
import { PasswordInput } from "../sharedComponents/PasswordInput";
import { useNavigation } from "react-navigation-hooks";

const m = defineMessages({
  enterPass: {
    id: "screens.EnterPassword.enterPass",
    defaultMessage: "Enter your passcode",
  },
  wrongPass: {
    id: "screens.EnterPassword.wrongPass",
    defaultMessage: "Incorrect password, please try again ",
  },
});

export const AuthScreen: NavigationStackScreenComponent = () => {
  const [error, setError] = React.useState(false);
  const [authState, setAuthState] = React.useContext(SecurityContext);

  const { navigate } = useNavigation();

  async function validatePass(inputtedPass: string, clearInput: () => void) {
    console.log("input" + inputtedPass);
    console.log("currentPass" + authState.passcode);
    console.log(await AsyncStorage.getItem(PASSWORD_KEY));
    if (inputtedPass === KILL_PASSCODE && authState.killModeEnabled) {
      setAuthState({ type: "toggleAppMode", newAppMode: "kill" });
      setAuthState({
        type: "setAuthStatus",
        newAuthStatus: "authenticated",
      });
      navigate("AppStack");
      return;
    }

    if (inputtedPass === authState.passcode) {
      if (authState.appMode === "kill") setAuthState({ type: "toggleAppMode" });

      setAuthState({
        type: "setAuthStatus",
        newAuthStatus: "authenticated",
      });
      navigate("AppStack");
      return;
    }

    setError(true);
    clearInput();
  }

  function handleError() {
    setError(true);
  }

  function clearError() {
    setError(false);
  }

  React.useEffect(() => {
    console.log("Outside", authState.passcode);
  }, []);

  return (
    <View style={[styles.container]}>
      <Image source={require("../images/icon_mapeo_pin.png")} />
      <Text style={[styles.title]}>Mapeo</Text>

      <Text style={[{ marginBottom: 20, fontSize: 16 }]}>
        <FormattedMessage {...m.enterPass} />
      </Text>

      <PasswordInput
        handleCorrectOrNewPass={validatePass}
        handleError={handleError}
        clearError={clearError}
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
    justifyContent: "center",
    marginTop: 40,
  },
  title: {
    fontSize: 52.5,
    color: DARK_BLUE,
    fontWeight: "500",
    marginBottom: 40,
  },
  codeFieldRoot: {
    marginTop: 20,
    maxWidth: 289,
    alignSelf: "center",
  },
  cell: {
    width: 49,
    height: 49,
    borderRadius: 8,
    fontSize: 24,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: MEDIUM_GREY,
    textAlign: "center",
  },
  focusCell: {
    borderColor: DARK_GREY,
  },
  wrongPass: {
    fontSize: 16,
    marginTop: 20,
    color: WARNING_RED,
  },
});

AuthScreen.navigationOptions = {
  headerShown: false,
};
