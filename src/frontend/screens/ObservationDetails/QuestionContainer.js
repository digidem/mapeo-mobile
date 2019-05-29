// @flow
import * as React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView
} from "react-native";

type Props = {
  children: React.Node,
  // Current question number
  current: number,
  // Total number of questions
  total: number,
  onPrev: () => any,
  onNext: () => any
};

const QuestionContainer = ({
  children,
  current,
  total,
  onNext,
  onPrev
}: Props) => (
  <KeyboardAvoidingView style={styles.container}>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.questionNumber}>Cuestión {current}</Text>
      <View style={styles.questionContainer}>{children}</View>
    </ScrollView>
  </KeyboardAvoidingView>
);

export default QuestionContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 15,
    paddingBottom: 20
  },
  questionNumber: {
    flex: 0,
    fontSize: 13,
    color: "black",
    marginVertical: 12,
    marginHorizontal: 5,
    fontWeight: "700"
  },
  questionContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F3F3F3"
  }
});
