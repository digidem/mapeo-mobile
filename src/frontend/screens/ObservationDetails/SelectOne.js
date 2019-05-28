// @flow
import React from "react";
import { View, StyleSheet, Text } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import QuestionContainer from "./QuestionContainer";
import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import type { Style } from "../../types";

type Props = {
  number: number,
  value?: string | number,
  label: string,
  options: Array<{| value: string, label: string |}>,
  hint?: string,
  onChange: (value: string) => any
};

type RadioItemProps = {
  checked: boolean,
  onPress: () => any,
  label: string,
  style: Style<typeof View>
};

const RadioItem = ({ checked, onPress, label, style }: RadioItemProps) => (
  <TouchableNativeFeedback onPress={onPress}>
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
  number,
  value,
  label,
  options,
  hint,
  onChange
}: Props) => (
  <QuestionContainer number={number}>
    <View style={styles.labelContainer}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.hint}>{hint}</Text>
    </View>
    {options.map((item, index) => (
      <RadioItem
        key={item.value}
        onPress={() => onChange(item.value)}
        checked={item.value === value}
        label={item.label}
        style={[styles.radioContainer, index === 0 ? styles.noBorder : {}]}
      />
    ))}
  </QuestionContainer>
);

export default SelectOne;

const styles = StyleSheet.create({
  labelContainer: {
    flex: 0,
    padding: 20,
    borderBottomWidth: 1,
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
    marginHorizontal: 20,
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
