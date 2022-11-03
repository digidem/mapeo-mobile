import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";

import { DARK_BLUE, RED, WHITE } from "../lib/styles";
import { SecurityContext } from "../context/SecurityContext";
import { PasscodeInput } from "../sharedComponents/PasscodeInput";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackList } from "../Navigation/AppStack";

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
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    function disableBack(e: any) {
      if (authState !== "unauthenticated") return;
      // Prevent back if unauthenticated
      e.preventDefault();
    }
    navigation.addListener("beforeRemove", disableBack);

    return () => {
      navigation.removeListener("beforeRemove", disableBack);
    };
  }, [authState, navigation]);

  React.useEffect(() => {
    if (authState === "unauthenticated") return;
    navigation.goBack();
  }, [authState, navigation]);

  function setInputWithValidation(passValue: string) {
    if (error) {
      setError(false);
    }
    setInputtedPass(passValue);
    if (passValue.length === 5) {
      validatePass(passValue);
    }
  }

  function validatePass(passValue: string) {
    try {
      authenticate(passValue);
    } catch (err) {
      scrollViewRef.current?.scrollToEnd();
      setError(true);
    }
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{ height: "100%", backgroundColor: WHITE }}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <Image source={require("../images/icon_mapeo_pin.png")} />
        <Text style={[styles.title]}>Mapeo</Text>

        <Text style={[{ marginBottom: 20, fontSize: 16 }]}>
          <FormattedMessage {...m.enterPass} />
        </Text>

        <PasscodeInput
          error={error}
          inputValue={inputtedPass}
          onChangeTextWithValidation={setInputWithValidation}
        />

        {error && (
          <Text style={[styles.wrongPass]}>
            <FormattedMessage {...m.wrongPass} />
          </Text>
        )}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    paddingHorizontal: 20,
    alignItems: "center",
    paddingTop: 40,
    backgroundColor: WHITE,
  },
  title: {
    fontSize: 52.5,
    color: DARK_BLUE,
    fontWeight: "500",
    marginBottom: 40,
  },
  wrongPass: {
    marginTop: 20,
    paddingBottom: 20,
    fontSize: 16,
    color: RED,
  },
});
