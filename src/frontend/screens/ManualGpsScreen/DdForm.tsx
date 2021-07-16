import * as React from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputEndEditingEventData,
  View,
} from "react-native";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";

import Text from "../../sharedComponents/Text";
import Select from "../../sharedComponents/Select";
import { BLACK, LIGHT_GREY } from "../../lib/styles";
import {
  POSITIVE_DECIMAL_REGEX,
  FormProps,
  getInitialCardinality,
  parseNumber,
} from "./shared";

const MAX_COORDINATE_INPUT_LENGTH = 11;

const m = defineMessages({
  invalidCoordinates: {
    id: "screens.ManualGpsScreen.DdForm.invalidCoordinates",
    defaultMessage: "Invalid coordinates",
  },
  latitude: {
    id: "screens.ManualGpsScreen.DdForm.latitude",
    defaultMessage: "Latitude",
  },
  longitude: {
    id: "screens.ManualGpsScreen.DdForm.longitude",
    defaultMessage: "Longitude",
  },
  north: {
    id: "screens.ManualGpsScreen.DdForm.north",
    defaultMessage: "North",
  },
  south: {
    id: "screens.ManualGpsScreen.DdForm.south",
    defaultMessage: "South",
  },
  east: {
    id: "screens.ManualGpsScreen.DdForm.east",
    defaultMessage: "East",
  },
  west: {
    id: "screens.ManualGpsScreen.DdForm.west",
    defaultMessage: "West",
  },
});

const DdForm = ({ coords, onValueUpdate }: FormProps) => {
  const { formatMessage: t } = useIntl();

  const DIRECTION_OPTIONS_NORTH_SOUTH = [
    {
      value: "N",
      label: t(m.north),
    },
    {
      value: "S",
      label: t(m.south),
    },
  ];

  const DIRECTION_OPTIONS_EAST_WEST = [
    {
      value: "E",
      label: t(m.east),
    },
    {
      value: "W",
      label: t(m.west),
    },
  ];

  const [latitudeDegrees, setLatitudeDegrees] = React.useState<string>(() =>
    typeof coords?.lat === "number" ? Math.abs(coords.lat).toString() : ""
  );
  const [longitudeDegrees, setLongitudeDegrees] = React.useState<string>(
    typeof coords?.lon === "number" ? Math.abs(coords.lon).toString() : ""
  );

  const [selectedLatCardinality, setSelectedLatCardinality] = React.useState(
    getInitialCardinality("lat", coords)
  );
  const [selectedLonCardinality, setSelectedLonCardinality] = React.useState(
    getInitialCardinality("lon", coords)
  );

  const parsedLat = parseNumber(latitudeDegrees);
  const parsedLon = parseNumber(longitudeDegrees);

  const signedLat =
    parsedLat !== undefined
      ? parsedLat * (selectedLatCardinality === "N" ? 1 : -1)
      : undefined;
  const signedLon =
    parsedLon !== undefined
      ? parsedLon * (selectedLonCardinality === "E" ? 1 : -1)
      : undefined;

  React.useEffect(() => {
    try {
      const latIsValidRange =
        signedLat !== undefined && Math.abs(signedLat) <= 90;
      const lonIsValidRange =
        signedLon !== undefined && Math.abs(signedLon) <= 180;

      if (latIsValidRange && lonIsValidRange) {
        onValueUpdate({
          coords: {
            lat: signedLat,
            lon: signedLon,
          },
        });
      } else {
        throw new Error(t(m.invalidCoordinates));
      }
    } catch (err) {
      onValueUpdate({
        error: err,
      });
    }
  }, [signedLat, signedLon, onValueUpdate]);

  const validateOnChange = (setState: (v: string) => void) => (
    text: string
  ) => {
    const isJustDecimal = text === ".";
    const endsWithDecimal = text.endsWith(".");

    if (
      text.length === 0 ||
      isJustDecimal ||
      endsWithDecimal ||
      POSITIVE_DECIMAL_REGEX.test(text)
    ) {
      setState(text);
    } else if (Number.parseFloat(text) === 0) {
      setState("0");
    }
  };

  const formatInputValue = (setState: (v: string) => void) => ({
    nativeEvent: { text },
  }: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
    const parsed = Number.parseFloat(text);
    if (!isNaN(parsed)) {
      // Do we want to enforce precision here?
      setState(parsed.toFixed(6));
    }
  };

  return (
    <View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.inputLabel}>
            <FormattedMessage {...m.latitude} />
          </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="silver"
            underlineColorAndroid="transparent"
            keyboardType="decimal-pad"
            onEndEditing={formatInputValue(setLatitudeDegrees)}
            onChangeText={validateOnChange(setLatitudeDegrees)}
            value={latitudeDegrees}
            style={styles.input}
            maxLength={MAX_COORDINATE_INPUT_LENGTH}
          />
        </View>
        <View style={styles.column}>
          <Select
            containerStyles={styles.select}
            mode="dropdown"
            onChange={setSelectedLatCardinality}
            options={DIRECTION_OPTIONS_NORTH_SOUTH}
            selectedValue={selectedLatCardinality}
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.inputLabel}>
            <FormattedMessage {...m.longitude} />
          </Text>
          <TextInput
            placeholder="0.00"
            placeholderTextColor="silver"
            underlineColorAndroid="transparent"
            keyboardType="decimal-pad"
            onEndEditing={formatInputValue(setLongitudeDegrees)}
            onChangeText={validateOnChange(setLongitudeDegrees)}
            style={styles.input}
            value={longitudeDegrees}
            maxLength={MAX_COORDINATE_INPUT_LENGTH}
          />
        </View>
        <View style={styles.column}>
          <Select
            containerStyles={styles.select}
            mode="dropdown"
            onChange={setSelectedLonCardinality}
            options={DIRECTION_OPTIONS_EAST_WEST}
            selectedValue={selectedLonCardinality}
          />
        </View>
      </View>
    </View>
  );
};

export default DdForm;

const styles = StyleSheet.create({
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
  },
  row: {
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  column: {
    flex: 1,
    marginHorizontal: 10,
    width: "50%",
  },
  select: {
    marginTop: 10,
  },
});
