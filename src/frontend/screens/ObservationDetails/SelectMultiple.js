// @flow
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import { VERY_LIGHT_BLUE } from "../../lib/styles";

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
    console.log("prev Value", valueAsArray);
    const updatedValue = valueAsArray.includes(itemValue)
      ? valueAsArray.filter(d => d !== itemValue)
      : [...valueAsArray, itemValue];
    console.log("new Value", updatedValue);
    onChange(updatedValue);
  };

  return (
    <>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {placeholder && <Text style={styles.hint}>{placeholder}</Text>}
      </View>
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
  labelContainer: {
    flex: 0,
    padding: 20,
    borderBottomWidth: 2,
    borderColor: "#F3F3F3"
  },
  label: {
    fontSize: 20,
    color: "black",
    fontWeight: "700"
  },
  hint: {
    fontSize: 12,
    color: "#A9A9A9",
    fontWeight: "700"
  },
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
