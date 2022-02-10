import { orderBy } from "lodash";
import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { View, Image, Text, StyleSheet } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { DARK_BLUE, MEDIUM_GREY } from "../lib/styles";

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
import { useNavigation } from "react-navigation-hooks";

const m = defineMessages({
  enterPass: {
    id: "screens.EnterPassword.enterPass",
    defaultMessage: "Enter your passcode",
  },
});

const CELL_COUNT = 5;
const onlyNumRegEx = new RegExp("^[0-9]+$");

export const EnterPassword: NavigationStackScreenComponent = () => {
  const [inputtedPass, setInputtedPass] = React.useState("");
  const { navigate } = useNavigation();
  const [tempMessage, setTempMessage] = React.useState("");
  const { setKillState, killState } = React.useContext(SecurityContext);
  const ref = useBlurOnFulfill({ value: inputtedPass, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: inputtedPass,
    setValue: setInputtedPass,
  });
  const userPass = React.useRef("");

  React.useEffect(() => {
    // setTempMessage(password)
    if (inputtedPass.length === CELL_COUNT) {
      if (validatePassword(inputtedPass)) {
        if (inputtedPass === KILL_PASSCODE) {
          setKillState(true);
          navigate("");
          return;
        }

        //password is valid, therefore they will be getting out of killMode
        if (killState) setKillState(false);
        navigate("");
      } else setInputtedPass("");
    }
  }, [inputtedPass]);

  React.useEffect(() => {
    AsyncStorage.getItem(PASSWORD_KEY, (err, result) => {
      if (!!err) return;

      userPass.current = result || "";
    });
  }, []);

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
        {/* <FormattedMessage {...m.enterPass} /> */}
        {tempMessage}
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
    </View>
  );
};

function validatePassword(password: string) {
  if (password.length !== CELL_COUNT) return false;

  const passAsArray = Array.from(password);
  return passAsArray.reduce((acc, letter) => {
    return onlyNumRegEx.test(letter);
  }, false);
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
    borderColor: "#00000030",
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#000",
  },
});
