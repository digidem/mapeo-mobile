import React from "react";
import { StyleSheet, Platform } from "react-native";
import { defineMessages, useIntl } from "react-intl";

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
  const { formatMessage: t } = useIntl();
  const current: number = +route.params.question;

  // TO Do: header title can only take a string, can't seem to extract the string
  useSetHeader({
    headerTitle: t(m.title, {
      current: current,
      preset: !!preset ? preset.fields.length : 0,
    }),
    headerRight: () => <DetailsHeaderRight question={current} />,
  });
  React.useEffect(() => {
    if (!preset || !preset.fields || current > preset.fields.length) {
      navigation.pop(current);
    }
  }, [preset, navigation, current]);

  const field = preset!.fields[current - 1];
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
