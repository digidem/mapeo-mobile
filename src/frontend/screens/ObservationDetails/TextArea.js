// @flow
import React from "react";
import { StyleSheet, TextInput } from "react-native";
import { useIntl } from "react-intl";
import { formatFieldProp } from "../../sharedComponents/FormattedData";
import QuestionLabel from "./QuestionLabel";

import type { QuestionProps } from "./Question";

const TextArea = ({ value, field, onChange }: QuestionProps) => {
  const intl = useIntl();
  return (
    <>
      <QuestionLabel field={field} />
      <TextInput
        value={value}
        onChangeText={onChange}
        accessible={true}
        accessibilityLabel={formatFieldProp(field, "label", intl)}
        accessibilityHint={formatFieldProp(field, "placeholder", intl)}
        placeholder={formatFieldProp(field, "placeholder", intl)}
        style={styles.textInput}
        underlineColorAndroid="transparent"
        multiline
        scrollEnabled={false}
        textContentType="none"
      />
    </>
  );
};

export default React.memo<QuestionProps>(TextArea);

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    minHeight: 150,
    fontSize: 20,
    padding: 20,
    marginBottom: 20,
    color: "black",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    textAlignVertical: "top",
  },
});
