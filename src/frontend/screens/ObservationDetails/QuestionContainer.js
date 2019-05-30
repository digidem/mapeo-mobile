// @flow
import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";

type Props = {
  children: React.Node
};

const QuestionContainer = ({ children }: Props) => (
  <ScrollView style={styles.container}>{children}</ScrollView>
);

export default QuestionContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
