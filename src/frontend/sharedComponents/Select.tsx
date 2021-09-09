import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { LIGHT_GREY } from "../lib/styles";
import { ViewStyleProp } from "../sharedTypes";

type Option<Value> = {
  value: Value;
  label: string;
};

type Props<Value> = {
  containerStyles?: ViewStyleProp;
  label?: string;
  mode?: "dialog" | "dropdown";
  onChange: (value: Value, index: number) => void;
  options: Option<Value>[];
  selectedValue: Value;
  testID?: string;
};

const Select = <Value extends string | number>({
  containerStyles,
  label,
  mode,
  onChange,
  options,
  selectedValue,
  testID,
}: Props<Value>) => (
  <View style={[styles.container, containerStyles]}>
    <Picker
      accessibilityLabel={label}
      mode={mode}
      onValueChange={onChange}
      selectedValue={selectedValue}
      style={styles.picker}
      testID={testID}
    >
      {options.map(option => (
        <Picker.Item key={option.value} {...option} />
      ))}
    </Picker>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    paddingTop: 3,
  },
  picker: {
    marginTop: -6,
    marginBottom: -3,
  },
});

export default Select;
