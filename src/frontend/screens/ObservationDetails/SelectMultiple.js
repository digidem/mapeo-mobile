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

type CheckItemProps = {
  checked: boolean,
  onPress: () => any,
  label: string,
  style: Style<typeof View>
};

const CheckItem = ({ checked, onPress, label, style }: CheckItemProps) => (
  <TouchableNativeFeedback
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}>
    <View style={style}>
      <MaterialIcon
        name={checked ? "check-box" : "check-box-outline-blank"}
        size={30}
      />
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
  </TouchableNativeFeedback>
);

const SelectMultiple = ({
  value,
  field: { placeholder, label, options },
  onChange
}: Props) => {
  const valueAsArray = toArray(value);

  const handleChange = itemValue => {
    const updatedValue = valueAsArray.includes(itemValue)
      ? valueAsArray.filter(d => d !== itemValue)
      : [...valueAsArray, itemValue];
    onChange(updatedValue);
  };

  return (
    <>
      <QuestionLabel label={label} hint={placeholder} />
      {options.map(convertItem).map((item, index) => (
        <CheckItem
          key={item.value}
          onPress={() => handleChange(item.value)}
          checked={valueAsArray.includes(item.value)}
          label={item.label}
          style={[styles.radioContainer, index === 0 ? styles.noBorder : {}]}
        />
      ))}
    </>
  );
};

function toArray(value) {
  // null or undefined
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

export default React.memo<Props>(SelectMultiple);

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
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#F3F3F3"
  },
  noBorder: {
    borderTopWidth: 0
  },
  itemLabel: {
    fontSize: 18,
    lineHeight: 24,
    marginLeft: 20,
    flex: 1,
    color: "black",
    fontWeight: "700"
  }
});
