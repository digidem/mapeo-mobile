// @flow
import React from "react";
import { StyleSheet, TextInput } from "react-native";
import QuestionLabel from "./QuestionLabel";

import type { QuestionProps } from "./Question";

const TextArea = ({
  value,
  field: { label, placeholder },
  onChange,
}: QuestionProps) => (
  <>
    <QuestionLabel label={label} hint={placeholder} />
    <TextInput
      value={value}
      onChangeText={onChange}
      style={styles.textInput}
      underlineColorAndroid="transparent"
      multiline
      scrollEnabled={false}
      textContentType="none"
    />
  </>
);

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
