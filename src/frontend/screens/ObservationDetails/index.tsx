import React from "react";
import { StyleSheet, Platform } from "react-native";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import Text from "../../sharedComponents/Text";
import TextButton from "../../sharedComponents/TextButton";
import QuestionContainer from "./QuestionContainer";
import Question from "./Question";
import Field from "../ObservationEdit/Field";
import { useDraftObservation } from "../../hooks/useDraftObservation";
import { NativeNavigationProp } from "../../sharedTypes";
import { useSetHeader } from "../../hooks/useSetHeader";
import { useNavigation } from "../../hooks/useNavigationWithTypes";
import { Preset } from "../../context/ConfigContext";

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

const ObservationDetails = ({
  navigation,
  route,
}: NativeNavigationProp<"ObservationDetails">) => {
  const [{ preset }] = useDraftObservation();
  const current: number = +route.params.question;

  useSetHeader({
    headerTitle: () => <DetailsTitle question={current} />,
    headerRight: () => <DetailsHeaderRight question={current} />,
  });

  if (!preset || !preset.fields || current > preset.fields.length) {
    navigation.pop(current);
    return null;
  }

  const field = preset.fields[current - 1];
  return (
    <Field field={field}>
      {/*  //TO DO: FIX
      // @ts-ignore */}
      {({ value, onChange }) => (
        <QuestionContainer>
          <Question field={field} value={value} onChange={onChange} />
        </QuestionContainer>
      )}
    </Field>
  );
};

const DetailsHeaderRight = ({ question }: { question: number }) => {
  const { formatMessage: t } = useIntl();
  const navigation = useNavigation();
  const [{ preset }] = useDraftObservation();
  const isLastQuestion = question >= (!!preset ? preset.fields.length : 0);
  const buttonText = isLastQuestion ? t(m.done) : t(m.nextQuestion);

  const onPress = () =>
    isLastQuestion
      ? navigation.navigate("ObservationEdit")
      : navigation.push("ObservationDetails", {
          question: question + 1,
        });

  return (
    <TextButton
      onPress={onPress}
      title={buttonText}
      style={styles.headerButton}
    />
  );
};

const DetailsTitle = ({ question }: { question: number }) => {
  const [{ preset }] = useDraftObservation();
  return (
    <Text numberOfLines={1} style={styles.title}>
      <FormattedMessage
        {...m.title}
        values={{
          current: question,
          total: !preset ? 0 : preset.fields,
        }}
      />
    </Text>
  );
};

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
