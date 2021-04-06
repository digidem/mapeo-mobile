// @flow
import React from "react";
import { StyleSheet, Platform } from "react-native";
import Text from "../../sharedComponents/Text";
import { defineMessages, useIntl, FormattedMessage } from "react-intl";

import TextButton from "../../sharedComponents/TextButton";
import QuestionContainer from "./QuestionContainer";
import Question from "./Question";
import Field from "../ObservationEdit/Field";
import useDraftObservation from "../../hooks/useDraftObservation";
import type { NavigationProp } from "../../types";

const m = defineMessages({
  nextQuestion: {
    id: "screens.ObservationDetails.nextQuestion",
    defaultMessage: "Next",
    description: "Button text to navigate to next question",
  },
  done: {
    id: "screens.ObservationDetails.done",
    defaultMessage: "Done",
    description: "Button text when all questions are complete",
  },
  title: {
    id: "screens.ObservationDetails.title",
    defaultMessage: "Question {current} of {total}",
    description:
      "Title of observation details screen showing question number and total",
  },
});

type Props = {
  navigation: NavigationProp,
};

const DetailsTitle = ({ navigation }: Props) => {
  const [{ preset = {} }] = useDraftObservation();
  return (
    <Text numberOfLines={1} style={styles.title}>
      <FormattedMessage
        {...m.title}
        values={{
          current: navigation.getParam("question"),
          total: (preset.fields || []).length,
        }}
      />
    </Text>
  );
};

const DetailsHeaderRight = ({ navigation }: Props) => {
  const { formatMessage: t } = useIntl();
  const [{ preset = {} }] = useDraftObservation();
  const current = navigation.getParam("question");
  const isLastQuestion = current >= (preset.fields || []).length;
  const buttonText = isLastQuestion ? t(m.done) : t(m.nextQuestion);
  const onPress = () =>
    isLastQuestion
      ? navigation.navigate("ObservationEdit")
      : navigation.push(navigation.state.routeName, {
          question: current + 1,
        });

  return (
    <TextButton
      onPress={onPress}
      title={buttonText}
      style={styles.headerButton}
    />
  );
};

const ObservationDetails = ({ navigation }: Props) => {
  const [{ preset = {} }] = useDraftObservation();

  const current: number = +navigation.getParam("question");
  if (!preset || !preset.fields || current > preset.fields.length)
    return navigation.pop(current);
  const field = preset.fields[current - 1];
  return (
    <Field field={field}>
      {({ value, onChange }) => (
        <QuestionContainer current={current}>
          <Question field={field} value={value} onChange={onChange} />
        </QuestionContainer>
      )}
    </Field>
  );
};

ObservationDetails.navigationOptions = ({ navigation }: any) => ({
  headerTitle: () => <DetailsTitle navigation={navigation} />,
  headerRight: () => <DetailsHeaderRight navigation={navigation} />,
});

export default ObservationDetails;

const styles = StyleSheet.create({
  title: {
    ...Platform.select({
      ios: {
        fontSize: 17,
        fontWeight: "600",
        color: "rgba(0, 0, 0, .9)",
        marginRight: 16,
      },
      android: {
        fontSize: 20,
        fontWeight: "500",
        color: "rgba(0, 0, 0, .9)",
        marginRight: 16,
      },
      default: {
        fontSize: 18,
        fontWeight: "400",
        color: "#3c4043",
      },
    }),
  },
  headerButton: {
    paddingHorizontal: 20,
    height: 60,
  },
});
