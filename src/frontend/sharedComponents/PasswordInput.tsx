import * as React from "react";
import { Text, StyleSheet, StyleProp, ViewStyle } from "react-native";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
  RenderCellOptions,
} from "react-native-confirmation-code-field";
import { SecurityContext } from "../context/SecurityContext";
import { MEDIUM_GREY, DARK_GREY } from "../lib/styles";

const CELL_COUNT = 5;
const onlyNumRegEx = new RegExp("^[0-9]+$");

interface PasswordInputProps {
  /**
   * Function that handles the error state of the parent screen
   */
  handleError: () => void;
  /**
   * When the input has a validated passcode, that passcode is passed to this function. A function to clear the input is also passed to the parent screen through this function
   */
  handleCorrectOrNewPass: (inputtedValue: string, clear: () => void) => void;
  /**
   * Function to clear the error of the parent screen
   */
  clearError: () => void;
  stylesProps?: StyleProp<ViewStyle>;
  /**
   * If set to true, the input will be focused on Open. Default: `true`
   */
  autoFocus: boolean;
}

export const PasswordInput = ({
  handleError,
  handleCorrectOrNewPass,
  stylesProps,
  clearError,
  autoFocus,
}: PasswordInputProps) => {
  const [inputtedPass, setInputtedPass] = React.useState("");
  const ref = useBlurOnFulfill({ value: inputtedPass, cellCount: CELL_COUNT });
  const [{ passcode, killModeEnabled }] = React.useContext(SecurityContext);

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: inputtedPass,
    setValue: setInputtedPass,
  });

  function clearInput() {
    setInputtedPass("");
  }

  React.useEffect(() => {
    //This assures that the error message is only shown when the user is not inputting a password (aka only right after the failed attempt)
    if (inputtedPass.length === 1) clearError();

    if (inputtedPass.length === CELL_COUNT) {
      if (!validatePassword(inputtedPass)) {
        handleError();
        return;
      }

      handleCorrectOrNewPass(inputtedPass, clearInput);
    }
  }, [inputtedPass, passcode, killModeEnabled]);

  function validateAndSetInput(text: string) {
    if (!text) setInputtedPass("");
    if (onlyNumRegEx.test(text)) {
      setInputtedPass(text);
    }
  }

  function renderCell({ index, symbol, isFocused }: RenderCellOptions) {
    let textChild;

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
  }

  return (
    <CodeField
      ref={ref}
      autoFocus={autoFocus}
      {...props}
      value={inputtedPass}
      onChangeText={validateAndSetInput}
      cellCount={CELL_COUNT}
      rootStyle={[styles.codeFieldRoot, stylesProps]}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={renderCell}
    />
  );
};

function validatePassword(password: string): boolean {
  if (password.length !== CELL_COUNT) return false;

  const passAsArray = Array.from(password);

  return passAsArray.every(letter => onlyNumRegEx.test(letter));
}

const styles = StyleSheet.create({
  cell: {
    width: 49,
    height: 49,
    borderRadius: 8,
    fontSize: 24,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: MEDIUM_GREY,
    textAlign: "center",
    textAlignVertical: "center",
  },
  focusCell: {
    borderColor: DARK_GREY,
    textAlignVertical: "top",
  },
  codeFieldRoot: {
    maxWidth: 289,
    alignSelf: "center",
  },
});
