// @flow
import React from "react";
import { View, StyleSheet, Text } from "react-native";

type Props = {|
  label: string,
  hint?: string
|};

const QuestionLabel = ({ label, hint }: Props) => (
  <View style={styles.labelContainer}>
    <Text style={styles.label}>{label}</Text>
    {hint && <Text style={styles.hint}>{hint}</Text>}
  </View>
);

export default QuestionLabel;

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
    fontSize: 16,
    color: "#666666",
    fontWeight: "500"
  }
});
