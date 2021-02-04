// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import Text from "../../sharedComponents/Text";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { useIntl } from "react-intl";

import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";
import { VERY_LIGHT_BLUE } from "../../lib/styles";
import QuestionLabel from "./QuestionLabel";
import { convertSelectOptionsToLabeled } from "../../lib/utils";

import type { ViewStyleProp } from "../../types";
import type { QuestionProps } from "./Question";
import type { SelectOneField } from "../../context/ConfigContext";

type Props = {
  ...$Exact<QuestionProps>,
  field: SelectOneField,
};

type RadioItemProps = {
  checked: boolean,
  onPress: () => any,
  label: string,
  style: ViewStyleProp,
};

const RadioItem = ({ checked, onPress, label, style }: RadioItemProps) => (
  <TouchableNativeFeedback
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}
  >
    <View style={style}>
      <MaterialIcon
        name={checked ? "radio-button-checked" : "radio-button-unchecked"}
        size={30}
      />
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
  </TouchableNativeFeedback>
);

const SelectOne = ({ value, field, onChange }: Props) => {
  const { formatMessage: t } = useIntl();

  return (
    <>
      <QuestionLabel field={field} />
      {convertSelectOptionsToLabeled(field.options).map((item, index) => (
        <RadioItem
          key={item.label}
          onPress={() => onChange(value === item.value ? null : item.value)}
          checked={item.value === value}
          label={t({
            id: `fields.${field.id}.options.${JSON.stringify(item.value)}`,
            defaultMessage: item.label,
          })}
          style={[styles.radioContainer, index === 0 ? styles.noBorder : {}]}
        />
      ))}
    </>
  );
};

export default React.memo<Props>(SelectOne);

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#F3F3F3",
  },
  noBorder: {
    borderTopWidth: 0,
  },
  itemLabel: {
    fontSize: 18,
    lineHeight: 24,
    marginLeft: 20,
    flex: 1,
    color: "black",
    fontWeight: "700",
  },
});
