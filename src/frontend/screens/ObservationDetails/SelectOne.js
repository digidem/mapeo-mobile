// @flow
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import { VERY_LIGHT_BLUE } from "../../lib/styles";
import QuestionLabel from "./QuestionLabel";

import type { Style } from "../../types";
import type { QuestionProps } from "./Question";
import type { SelectField } from "../../context/PresetsContext";

type Props = {
  ...$Exact<QuestionProps>,
  field: SelectField
};

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
        size={30}
      />
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
  </TouchableNativeFeedback>
);

const SelectOne = ({
  value,
  field: { placeholder, label, options },
  onChange
}: Props) => (
  <>
    <QuestionLabel label={label} hint={placeholder} />
    {options.map(convertItem).map((item, index) => (
      <RadioItem
        key={item.value}
        onPress={() => onChange(value === item.value ? null : item.value)}
        checked={item.value === value}
        label={item.label}
        style={[styles.radioContainer, index === 0 ? styles.noBorder : {}]}
      />
    ))}
  </>
);

export default React.memo<Props>(SelectOne);

// We allow select options to be an array of strings, or objects with values and
// labels
function convertItem(item): { value: number | string, label: string } {
  if (typeof item !== "string" && typeof item !== "number") return item;
  return { value: item, label: item + "" };
}

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    marginLeft: 20,
    paddingRight: 20,
    borderTopWidth: 1,
    borderColor: "#F3F3F3"
  },
  noBorder: {
    borderTopWidth: 0
  },
  itemLabel: {
    fontSize: 18,
    marginLeft: 20,
    color: "black",
    fontWeight: "700"
  }
});
