// @flow
import React from "react";
import { Text, StyleSheet, Platform } from "react-native";
import type { NavigationScreenConfigProps } from "react-navigation";

import TextButton from "../../sharedComponents/TextButton";
import QuestionContainer from "./QuestionContainer";
import Question from "./Question";
import Field from "../ObservationEdit/Field";
import useDraftObservation from "../../hooks/useDraftObservation";

const DetailsTitle = ({ navigation }: any) => {
  const [{ preset = {} }] = useDraftObservation();
  return (
    <Text
      numberOfLines={1}
      style={styles.title}
    >{`Pregunta ${navigation.getParam("question")} de ${
      (preset.fields || []).length
    }`}</Text>
  );
};

const DetailsHeaderRight = ({ navigation }: any) => {
  const [{ preset = {} }] = useDraftObservation();
  const current = navigation.getParam("question");
  const isLastQuestion = current >= (preset.fields || []).length;
  const buttonText = isLastQuestion ? "Listo" : "Sigue";
  const onPress = () =>
    isLastQuestion
      ? navigation.pop(current)
      : navigation.push(navigation.state.routeName, {
          question: current + 1
        });

  return (
    <TextButton
      onPress={onPress}
      title={buttonText}
      style={styles.headerButton}
    />
  );
};

const ObservationDetails = ({ navigation }: NavigationScreenConfigProps) => {
  const [{ preset = {} }] = useDraftObservation();

  const current: number = +navigation.getParam("question");
  if (!preset || !preset.fields || current > preset.fields.length)
    // $FlowFixMe
    return navigation.pop(current);
  const field = preset.fields[current - 1];
  return (
    <Field fieldKey={field.key}>
      {({ value, onChange }) => (
        <QuestionContainer current={current}>
          <Question field={field} value={value} onChange={onChange} />
        </QuestionContainer>
      )}
    </Field>
  );
};

ObservationDetails.navigationOptions = ({ navigation }: any) => ({
  headerTitle: <DetailsTitle navigation={navigation} />,
  headerRight: <DetailsHeaderRight navigation={navigation} />
});

export default ObservationDetails;

const styles = StyleSheet.create({
  title: {
    ...Platform.select({
      ios: {
        fontSize: 17,
        fontWeight: "600",
        color: "rgba(0, 0, 0, .9)",
        marginRight: 16
      },
      android: {
        fontSize: 20,
        fontWeight: "500",
        color: "rgba(0, 0, 0, .9)",
        marginRight: 16
      },
      default: {
        fontSize: 18,
        fontWeight: "400",
        color: "#3c4043"
      }
    })
  },
  headerButton: {
    paddingHorizontal: 20,
    height: 60
  }
});
