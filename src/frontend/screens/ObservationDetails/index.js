// @flow
import React from "react";
import { Text, StyleSheet, Platform } from "react-native";
import type { NavigationScreenConfigProps } from "react-navigation";

import TextButton from "../../sharedComponents/TextButton";
import QuestionContainer from "./QuestionContainer";
import SelectOne from "./SelectOne";
// import TextArea from "./TextArea";
import Field from "../ObservationEdit/Field";
import DraftObservationPreset from "../../context/DraftObservationPreset";

const fieldsFixture = [
  {
    id: "monitor_name",
    key: "nombre",
    type: "select-one",
    label: "Nombre del monitor",
    options: [
      {
        value: "aliya",
        label: "Aliya Ryan"
      },
      {
        value: "jen",
        label: "Jen Castro"
      },
      {
        value: "gregor",
        label: "Gregor John MacLennan"
      },
      {
        value: "emily",
        label: "Emily Jacobi"
      }
    ]
  },
  {
    id: "community",
    key: "comunidad",
    type: "select-one",
    label: "Nombre de la comunidad",
    options: [
      {
        value: "edinburgh",
        label: "Edinburgo"
      },
      {
        value: "vancouver",
        label: "Vancouver"
      },
      {
        value: "londres",
        label: "Londres"
      },
      {
        value: "oakland",
        label: "Oakland"
      }
    ]
  }
];

const DetailsTitle = ({ navigation }: any) => (
  <DraftObservationPreset>
    {({ observationValue, preset = {} }) => (
      <Text
        numberOfLines={1}
        style={styles.title}
      >{`Pregunta ${navigation.getParam("question")} de ${
        (preset.fields || []).length
      }`}</Text>
    )}
  </DraftObservationPreset>
);

const DetailsHeaderRight = ({ navigation }: any) => (
  <DraftObservationPreset>
    {({ observationValue, preset = {} }) => {
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
    }}
  </DraftObservationPreset>
);

class ObservationDetails extends React.Component<NavigationScreenConfigProps> {
  static navigationOptions = ({ navigation }: any) => ({
    headerTitle: <DetailsTitle navigation={navigation} />,
    headerRight: <DetailsHeaderRight navigation={navigation} />
  });
  render() {
    const { navigation } = this.props;
    // It's important that the props are shallow-equal between renders.
    // ObservationEditView is a memoized/pure component, so it will not
    // re-render when props are shallow-equal. We auto-save edits to observation
    // fields to DraftObservationContext on every keypress, so the children of
    // the context will re-render frequently. The properties passed to
    // ObservationEditView here must not be inline functions (`() =>
    // doSomething)`) or inline objects (`myProp={{ foo: "bar" }}`) because
    // these change on every render.
    return (
      <DraftObservationPreset>
        {({ observationValue, preset }) => {
          const current: number = +navigation.getParam("question");
          if (current > fieldsFixture.length) return navigation.popToTop();
          const field = fieldsFixture[current - 1];
          return (
            <Field fieldKey={field.key}>
              {({ value, onChange }) => (
                <QuestionContainer current={current}>
                  <SelectOne
                    options={field.options}
                    value={value}
                    label={field.label}
                    onChange={onChange}
                  />
                </QuestionContainer>
              )}
            </Field>
          );
        }}
      </DraftObservationPreset>
    );
  }
}

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
