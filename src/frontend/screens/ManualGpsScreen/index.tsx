import * as React from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  KeyboardAvoidingView,
} from "react-native";
import Text from "../../sharedComponents/Text";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";

import useSettingsValue from "../../hooks/useSettingsValue";
import createPersistedState from "../../hooks/usePersistedState";
import { BLACK } from "../../lib/styles";
import { useDraftObservation } from "../../hooks/useDraftObservation";
import IconButton from "../../sharedComponents/IconButton";
import { SaveIcon } from "../../sharedComponents/icons";
import Select from "../../sharedComponents/Select";

import { ConvertedCoordinateData } from "./shared";
import DdForm from "./DdForm";
import DmsForm from "./DmsForm";
import UtmForm from "./UtmForm";
import { NativeNavigationProp } from "../../sharedTypes";
import { useSetHeader } from "../../hooks/useSetHeader";
import { CoordinateFormat } from "../../context/SettingsContext";

const m = defineMessages({
  title: {
    id: "screens.ManualGpsScreen.title",
    defaultMessage: "Enter coordinates",
    description: "title of manual GPS screen",
  },
  coordinateFormat: {
    id: "screens.ManualGpsScreen.coordinateFormat",
    defaultMessage: "Coordinate Format",
  },
  decimalDegrees: {
    id: "screens.ManualGpsScreen.decimalDegrees",
    defaultMessage: "Decimal Degrees (DD)",
  },
  degreesMinutesSeconds: {
    id: "screens.ManualGpsScreen.degreesMinutesSeconds",
    defaultMessage: "Degrees/Minutes/Seconds (DMS)",
  },
  universalTransverseMercator: {
    id: "screens.ManualGpsScreen.universalTransverseMercator",
    defaultMessage: "Universal Transverse Mercator (UTM)",
  },
});

const usePersistedState = createPersistedState("manualCoordinateEntryFormat");

const ManualGpsScreen = ({
  navigation,
}: NativeNavigationProp<"ManualGpsScreen">) => {
  const { formatMessage: t } = useIntl();

  useSetHeader({
    headerTitle: m.title,
    headerRight: () => (
      <IconButton onPress={handleSavePress}>
        <SaveIcon inprogress={false} />
      </IconButton>
    ),
  });

  const ENTRY_FORMAT_OPTIONS = [
    { label: t(m.decimalDegrees), value: "dd" },
    { label: t(m.degreesMinutesSeconds), value: "dms" },
    { label: t(m.universalTransverseMercator), value: "utm" },
  ];

  const coordinateFormat = useSettingsValue("coordinateFormat");

  const [
    entryCoordinateFormat,
    status,
    setEntryCoordinateFormat,
  ] = usePersistedState(coordinateFormat);

  const [{ value }, { updateDraft }] = useDraftObservation();

  const [convertedData, setConvertedData] = React.useState<
    ConvertedCoordinateData
  >({});

  const handleSavePress = React.useCallback(() => {
    try {
      if (convertedData.error) {
        throw convertedData.error;
      }

      updateDraft({
        ...convertedData.coords,
        metadata: {
          ...(value || {}).metadata,
          manualLocation: true,
        },
        tags: (value || {}).tags,
      });

      navigation.pop();
    } catch (err) {
      if (err instanceof Error) {
        ToastAndroid.showWithGravity(
          err.message,
          ToastAndroid.LONG,
          ToastAndroid.TOP
        );
      }
    }
  }, [convertedData, updateDraft, navigation]);

  if (status === "loading") {
    return null;
  }

  function handleOnChangeSelect(value: string | number, index: number) {
    if (typeof value === "number") return;

    if (!isCoordinateFormat(value)) return;

    setEntryCoordinateFormat(value);
  }

  return (
    <View>
      {/* Set `behavior` to "padding" when iOS is supported */}
      <KeyboardAvoidingView>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingVertical: 20,
          }}
        >
          <View style={styles.formatSelect}>
            <Text style={styles.inputLabel}>
              <FormattedMessage {...m.coordinateFormat} />
            </Text>
            <Select
              containerStyles={styles.selectContainer}
              onChange={handleOnChangeSelect}
              options={ENTRY_FORMAT_OPTIONS}
              selectedValue={entryCoordinateFormat}
            />
          </View>

          <View style={styles.formContainer}>
            {entryCoordinateFormat === "dd" ? (
              <DdForm onValueUpdate={setConvertedData} />
            ) : entryCoordinateFormat === "dms" ? (
              <DmsForm onValueUpdate={setConvertedData} />
            ) : (
              <UtmForm onValueUpdate={setConvertedData} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ManualGpsScreen;

function isCoordinateFormat(value: string): value is CoordinateFormat {
  return value === "dd" || value === "dms" || value === "utm";
}

const styles = StyleSheet.create({
  selectContainer: {
    marginVertical: 10,
  },
  inputLabel: {
    fontWeight: "bold",
    color: BLACK,
  },
  formatSelect: {
    marginHorizontal: 10,
  },
  formContainer: {
    marginVertical: 20,
  },
});
