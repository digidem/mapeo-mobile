import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";

type QuestionContainerProps = {
  children: React.ReactNode;
};

const QuestionContainer = ({ children }: QuestionContainerProps) => (
  <ScrollView style={styles.container}>{children}</ScrollView>
);

export default QuestionContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
