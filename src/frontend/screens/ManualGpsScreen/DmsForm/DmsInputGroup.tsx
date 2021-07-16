import * as React from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputEndEditingEventData,
  View,
} from "react-native";
import { FormattedMessage, defineMessages } from "react-intl";

import Text from "../../../sharedComponents/Text";
import Select from "../../../sharedComponents/Select";
import { BLACK, LIGHT_GREY } from "../../../lib/styles";
import { INTEGER_REGEX, parseNumber } from "../shared";
import { DmsData, DmsUnit } from "./index";

const m = defineMessages({
  degrees: {
    id: "screens.ManualGpsScreen.DmsForm.DmsInputGroup.degrees",
    defaultMessage: "Degrees",
  },
  minutes: {
    id: "screens.ManualGpsScreen.DmsForm.DmsInputGroup.minutes",
    defaultMessage: "Minutes",
  },
  seconds: {
    id: "screens.ManualGpsScreen.DmsForm.DmsInputGroup.seconds",
    defaultMessage: "Seconds",
  },
  direction: {
    id: "screens.ManualGpsScreen.DmsForm.DmsInputGroup.direction",
    defaultMessage: "Direction",
  },
});

interface Props {
  cardinalityOptions: { label: string; value: string }[];
  coordinate: DmsData;
  label: React.ReactNode;
  selectedCardinality: string;
  updateCardinality: (value: string) => void;
  updateCoordinate: (unit: DmsUnit, value: string) => void;
}

const DmsInputGroup = ({
  cardinalityOptions,
  coordinate,
  label,
  selectedCardinality,
  updateCardinality,
  updateCoordinate,
}: Props) => {
  const updateCoordinateCallback = React.useCallback(
    (unit: DmsUnit) => (value: string) => {
      if (value.length === 0) {
        updateCoordinate(unit, value);
        return;
      }

      if (unit === "seconds") {
        updateCoordinate(unit, value);
      } else {
        if (INTEGER_REGEX.test(value)) {
          updateCoordinate(unit, value);
        }
      }
    },
    [updateCoordinate]
  );

  const formatInputValue = (unit: DmsUnit) => ({
    nativeEvent: { text },
  }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const formatted = parseNumber(text);
    if (formatted !== undefined) {
      updateCoordinateCallback(unit)(formatted.toString());
    }
  };

  return (
    <View style={styles.groupContainer}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.inputLabel}>{label}</Text>
          <View style={styles.inputsContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                keyboardType="number-pad"
                maxLength={3}
                onChangeText={updateCoordinateCallback("degrees")}
                onEndEditing={formatInputValue("degrees")}
                placeholder="0"
                placeholderTextColor="silver"
                style={styles.input}
                underlineColorAndroid="transparent"
                value={coordinate.degrees}
              />
              <Text>
                <FormattedMessage {...m.degrees} />
              </Text>
            </View>
            <Text style={styles.suffix}>{"°"}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                keyboardType="number-pad"
                maxLength={2}
                onChangeText={updateCoordinateCallback("minutes")}
                onEndEditing={formatInputValue("minutes")}
                placeholder="0"
                placeholderTextColor="silver"
                style={styles.input}
                underlineColorAndroid="transparent"
                value={coordinate.minutes}
              />
              <Text>
                <FormattedMessage {...m.minutes} />
              </Text>
            </View>
            <Text style={styles.suffix}>{"'"}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                keyboardType="decimal-pad"
                maxLength={6}
                onChangeText={updateCoordinateCallback("seconds")}
                onEndEditing={formatInputValue("seconds")}
                placeholder="0.00"
                placeholderTextColor="silver"
                style={styles.input}
                underlineColorAndroid="transparent"
                value={coordinate.seconds}
              />
              <Text>
                <FormattedMessage {...m.seconds} />
              </Text>
            </View>
            <Text style={styles.suffix}>{'"'}</Text>
          </View>
        </View>
      </View>
      <View style={styles.directionSelectContainer}>
        <Text>
          <FormattedMessage {...m.direction} />:
        </Text>
        <Select
          mode="dropdown"
          containerStyles={{ width: 150, marginHorizontal: 20 }}
          onChange={updateCardinality}
          options={cardinalityOptions}
          selectedValue={selectedCardinality}
        />
      </View>
    </View>
  );
};

export default DmsInputGroup;

const styles = StyleSheet.create({
  groupContainer: {
    marginBottom: 40,
    marginHorizontal: 10,
  },
  inputsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontWeight: "bold",
    color: BLACK,
  },
  input: {
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  row: {
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  column: {
    flex: 1,
  },
  suffix: {
    fontSize: 20,
    marginLeft: 5,
    marginRight: 10,
    paddingTop: 5,
  },
  directionSelectContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
