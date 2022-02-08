import { orderBy } from "lodash";
import * as React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { View, Image, Text, StyleSheet } from "react-native";
import { NavigationStackScreenComponent } from "react-navigation-stack";
import { MEDIUM_GREY } from "../lib/styles";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from "react-native-confirmation-code-field";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { PASSWORD_KEY } from "../constants";

const m = defineMessages({
  enterPass: {
    id: "screens.EnterPassword.enterPass",
    defaultMessage: "Enter your passcode",
  },
});

const CELL_COUNT = 5;

export const EnterPassword: NavigationStackScreenComponent = () => {
  const [password, setPassword] = React.useState("");
  const ref = useBlurOnFulfill({ value: password, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: password,
    setValue: setPassword,
  });
  const userPass = React.useRef("");

  React.useEffect(() => {
    if (password.length === CELL_COUNT) {
      if (!validatePassword(password)) {
      }
    }
  }, [password]);

  React.useEffect(() => {
    AsyncStorage.getItem(PASSWORD_KEY, (err, result) => {
      if (!!err) return;

      userPass.current = result || "";
    });
  }, []);

  const renderCell = ({ index, symbol, isFocused }: any) => {
    let textChild = null;

    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="*"
          isLastFilledCell={isLastFilledCell({ index, value: password })}
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
      <Text>Mapeo</Text>

      <Text>
        <FormattedMessage {...m.enterPass} />
      </Text>

      <CodeField
        ref={ref}
        {...props}
        value={password}
        caretHidden={true}
        onChangeText={setPassword}
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
  const parsedNumber = parseInt(password);

  if (isNaN(parsedNumber)) return false;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
  },
  codeFieldRoot: {
    marginTop: 20,
  },
  cell: {
    width: 40,
    height: 40,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#000",
  },
});
