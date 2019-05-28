// @flow
import React from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";

import QuestionContainer from "./QuestionContainer";

type Props = {
  number: number,
  value?: string,
  label: string,
  hint?: string,
  onChange: (value: string) => any
};

const TextArea = ({ number, value, label, hint, onChange }: Props) => (
  <QuestionContainer number={number}>
    <View style={styles.labelContainer}>
      <Text style={styles.label}>{label}</Text>
    </View>
    <TextInput
      value={value}
      onChangeText={onChange}
      style={styles.textInput}
      placeholder={hint}
      placeholderTextColor="silver"
      underlineColorAndroid="transparent"
      multiline
      scrollEnabled={false}
      textContentType="none"
    />
  </QuestionContainer>
);

export default TextArea;

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
  textInput: {
    flex: 1,
    minHeight: 150,
    fontSize: 20,
    padding: 20,
    marginBottom: 20,
    color: "black",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    textAlignVertical: "top"
  }
});
