// @flow
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import { VERY_LIGHT_BLUE } from "../../lib/styles";

import type { Style } from "../../types";

type Props = {|
  value: any,
  onChange: (value: any) => any,
  options: Array<{|
    value: any,
    label: string
  |}>
|};

type RadioItemProps = {
  checked: boolean,
  onPress: () => any,
  label: string,
  style: Style<typeof View>
};

const RadioItem = ({ checked, onPress, label, style }: RadioItemProps) => (
  <TouchableNativeFeedback
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}>
    <View style={style}>
      <MaterialIcon
        name={checked ? "radio-button-checked" : "radio-button-unchecked"}
        size={20}
      />
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
  </TouchableNativeFeedback>
);

const SelectOne = ({ value, options, onChange }: Props) => (
  <>
    {options.map((item, index) => (
      <RadioItem
        key={item.value}
        onPress={() => onChange(value === item.value ? null : item.value)}
        checked={item.value === value}
        label={item.label}
        style={styles.radioContainer}
      />
    ))}
  </>
);

export default React.memo<Props>(SelectOne);

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    marginHorizontal: 20
  },
  itemLabel: {
    fontSize: 16,
    lineHeight: 1.5 * 16,
    color: "rgba(0, 0, 0, 0.87)",
    marginLeft: 20,
    flex: 1,
    fontWeight: "400"
  }
});
