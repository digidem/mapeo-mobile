// @flow
import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BLACK, LIGHT_GREY, MAPEO_BLUE } from "../lib/styles";
import Text from "./Text";

type Option<Value> = {|
  value: Value,
  label: string,
|};

type Props<Value> = {
  mode?: "dialog" | "dropdown",
  onChange: <V: string | number>(value: V, index: number) => void,
  options: Option<Value>[],
  selectedValue: Value,
  // $FlowFixMe
  containerStyles?: any,
};

const Select = <Value: string | number>({
  options,
  selectedValue,
  onChange,
  mode,
  containerStyles,
}: Props<Value>) => {
  return (
    <View style={{ ...styles.container, ...containerStyles }}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onChange}
        style={styles.picker}
        mode={mode}
      >
        {options.map(option => (
          <Picker.Item key={option.value} {...option} />
        ))}
      </Picker>
    </View>
  );
};

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
