import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { View, Image, Text, StyleSheet } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { DARK_BLUE, DARK_GREY, MEDIUM_GREY, WARNING_RED } from "../lib/styles";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
  RenderCellOptions,
} from "react-native-confirmation-code-field";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { KILL_PASSCODE, PASSWORD_KEY } from "../constants";
import { SecurityContext } from "../context/SecurityContext";

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

const CELL_COUNT = 5;
const onlyNumRegEx = new RegExp("^[0-9]+$");

export const AuthScreen: NavigationStackScreenComponent = () => {
  const [inputtedPass, setInputtedPass] = React.useState("");
  const [error, setError] = React.useState(false);
  const {
    setKillState,
    killState,
    setCheckFlag,
    passcode,
    killStateActive,
  } = React.useContext(SecurityContext);
  const ref = useBlurOnFulfill({ value: inputtedPass, cellCount: CELL_COUNT });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: inputtedPass,
    setValue: setInputtedPass,
  });

  React.useEffect(() => {
    if (inputtedPass.length === CELL_COUNT) {
      if (validatePassword(inputtedPass)) {
        if (inputtedPass === KILL_PASSCODE && killStateActive) {
          setKillState(true);
          setCheckFlag(false);
          return;
        }

        if (inputtedPass === passcode) {
          if (killState) setKillState(false);
          setCheckFlag(false);
          return;
        }

        setError(true);
      }

      setInputtedPass("");
    }
  }, [inputtedPass]);

  function validateAndSetInput(text: string) {
    if (onlyNumRegEx.test(text)) {
      setInputtedPass(text);
    }
  }

  const renderCell = ({ index, symbol, isFocused }: RenderCellOptions) => {
    let textChild = null;

    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="*"
          isLastFilledCell={isLastFilledCell({ index, value: inputtedPass })}
        >
          {symbol}
        </MaskSymbol>
      );
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {textChild}
      </Text>
    );
  };

  return (
    <View style={[styles.container]}>
      <Image source={require("../images/icon_mapeo_pin.png")} />
      <Text style={[styles.title]}>Mapeo</Text>

      <Text style={[{ marginBottom: 20, fontSize: 16 }]}>
        <FormattedMessage {...m.enterPass} />
      </Text>

      <CodeField
        ref={ref}
        {...props}
        value={inputtedPass}
        caretHidden={true}
        onChangeText={validateAndSetInput}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />

      {inputtedPass.length === 0 && error && (
        <Text style={[styles.wrongPass]}>
          <FormattedMessage {...m.wrongPass} />
        </Text>
      )}
    </View>
  );
};

function validatePassword(password: string): boolean {
  if (password.length !== CELL_COUNT) return false;

  const passAsArray = Array.from(password);

  return passAsArray.every(letter => onlyNumRegEx.test(letter));
}

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
