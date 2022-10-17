import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { View, Image, Text, StyleSheet, BackHandler } from "react-native";

import { DARK_BLUE, RED, WHITE } from "../lib/styles";
import { SecurityContext } from "../context/SecurityContext";
import { PasscodeInput } from "../sharedComponents/PasscodeInput";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackList } from "../Navigation/AppStack";
import { useFocusEffect } from "@react-navigation/native";

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

export const AuthScreen = ({
  navigation,
}: NativeStackScreenProps<AppStackList, "AuthScreen">) => {
  const [error, setError] = React.useState(false);
  const { authenticate, authState } = React.useContext(SecurityContext);
  const [inputtedPass, setInputtedPass] = React.useState("");

  const disableBack = React.useCallback((e: any) => {
    e.preventDefault();
  }, []);

  const removeListener = React.useCallback(() => {
    navigation.removeListener("beforeRemove", disableBack);
  }, [navigation]);

  React.useEffect(() => {
    if (authState === "unauthenticated") {
      navigation.addListener("beforeRemove", disableBack);
    }
  }, [authState, navigation, disableBack]);

  function removeListenerAndGoBack() {
    removeListener();
    navigation.goBack();
  }

  function setInputWithValidation(passValue: string) {
    if (error) setError(false);
    setInputtedPass(passValue);
    if (passValue.length === 5) {
      validatePass(passValue);
    }
  }

  function validatePass(passValue: string) {
    try {
      authenticate(passValue, {
        validateOnly: false,
        removeListenerAndGoBack,
      });
    } catch (err) {
      setError(true);
    }
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
        onChangeTextWithValidation={setInputWithValidation}
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
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
    backgroundColor: WHITE,
    flex: 1,
  },
  title: {
    fontSize: 52.5,
    color: DARK_BLUE,
    fontWeight: "500",
    marginBottom: 40,
  },
  wrongPass: {
    marginTop: 20,
    fontSize: 16,
    color: RED,
  },
});
