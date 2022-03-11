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
import { MEDIUM_GREY, DARK_GREY } from "../lib/styles";

export const CELL_COUNT = 5;
const onlyNumRegEx = new RegExp("^[0-9]+$");

interface PasswordInputProps {
  stylesProps?: StyleProp<ViewStyle>;
  inputValue: string;
  onChangeTextWithValidation: (newVal: string) => void;
}

export const PasswordInput = ({
  stylesProps,
  inputValue,
  onChangeTextWithValidation,
}: PasswordInputProps) => {
  const ref = useBlurOnFulfill({ value: inputValue, cellCount: CELL_COUNT });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: inputValue,
    setValue: onChangeTextWithValidation,
  });

  function validateAndSetInput(text: string) {
    if (!text) onChangeTextWithValidation("");
    if (onlyNumRegEx.test(text)) {
      onChangeTextWithValidation(text);
    }
  }

  function renderCell({ index, symbol, isFocused }: RenderCellOptions) {
    let textChild;

    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="*"
          isLastFilledCell={isLastFilledCell({ index, value: inputValue })}
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
      key={2}
      ref={ref}
      autoFocus={true}
      {...props}
      value={inputValue}
      onChangeText={validateAndSetInput}
      cellCount={CELL_COUNT}
      rootStyle={[styles.codeFieldRoot, stylesProps]}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={renderCell}
    />
  );
};

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
