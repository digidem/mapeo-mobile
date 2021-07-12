// @flow
import * as React from "react";
import { fromLatLon } from "utm";
import {
  View,
  ScrollView,
  TextInput,
  StyleSheet,
  ToastAndroid,
  KeyboardAvoidingView,
} from "react-native";
import Text from "../../sharedComponents/Text";
import { FormattedMessage, defineMessages, useIntl } from "react-intl";

import useSettingsValue from "../../hooks/useSettingsValue";
import createPersistedState from "../../hooks/usePersistedState";
import { BLACK, LIGHT_GREY } from "../../lib/styles";
import HeaderTitle from "../../sharedComponents/HeaderTitle";
import useDraftObservation from "../../hooks/useDraftObservation";
import LocationContext from "../../context/LocationContext";
import type { NavigationProp } from "../../types";
import IconButton from "../../sharedComponents/IconButton";
import { BackIcon, SaveIcon } from "../../sharedComponents/icons";
import Select from "../../sharedComponents/Select";

import DdForm from "./DdForm";
import DmsForm from "./DmsForm";
import UtmForm from "./UtmForm";

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

type Props = {
  navigation: NavigationProp,
};

const ManualGpsScreen = ({ navigation }: Props) => {
  const { formatMessage } = useIntl();

  const ENTRY_FORMAT_OPTIONS = [
    { label: formatMessage(m.decimalDegrees), value: "dd" },
    { label: formatMessage(m.degreesMinutesSeconds), value: "dms" },
    { label: formatMessage(m.universalTransverseMercator), value: "utm" },
  ];

  const location = React.useContext(LocationContext);
  const coordinateFormat = useSettingsValue("coordinateFormat");

  const [
    entryCoordinateFormat,
    status,
    setEntryCoordinateFormat,
  ] = usePersistedState(coordinateFormat);

  const [{ value }, { updateDraft }] = useDraftObservation();

  const [convertedData, setConvertedData] = React.useState<{|
    error?: Error,
    coords?: {| lat?: number | null, lon?: number | null |},
  |}>(() => ({
    coords: value ? { lat: value.lat, lon: value.lon } : undefined,
  }));

  React.useEffect(() => {
    function handleSavePress() {
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
        ToastAndroid.showWithGravity(
          err.message,
          ToastAndroid.LONG,
          ToastAndroid.TOP
        );
      }
    }

    navigation.setParams({ handleSavePress });
    // The navigation prop changes on every render, so it causes in infinite
    // loop here if included. Not including it might cause unexpected bugs, but
    // the setParams() and pop() methods should be always the same. TODO: Fix
    // this and make sure we're not going to cause a bug with this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convertedData, updateDraft]);

  if (status === "loading") {
    return null;
  }

  return (
    <KeyboardAvoidingView behavior="height">
      <ScrollView style={styles.container}>
        <View style={styles.formatSelect}>
          <Text style={styles.inputLabel}>
            <FormattedMessage {...m.coordinateFormat} />
          </Text>
          <Select
            containerStyles={styles.selectContainer}
            selectedValue={entryCoordinateFormat}
            onChange={setEntryCoordinateFormat}
            options={ENTRY_FORMAT_OPTIONS}
          />
        </View>

        <View style={styles.formContainer}>
          {entryCoordinateFormat === "dd" ? (
            <DdForm location={location} onValueUpdate={setConvertedData} />
          ) : entryCoordinateFormat === "dms" ? (
            <DmsForm location={location} onValueUpdate={setConvertedData} />
          ) : (
            <UtmForm location={location} onValueUpdate={setConvertedData} />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

ManualGpsScreen.navigationOptions = ({ navigation }: any) => {
  return {
    headerTitle: () => (
      <HeaderTitle>
        <FormattedMessage {...m.title} />
      </HeaderTitle>
    ),
    headerLeft: ({ onPress }) => (
      <IconButton onPress={onPress}>
        <BackIcon />
      </IconButton>
    ),
    headerRight: () => (
      <IconButton onPress={navigation.getParam("handleSavePress")}>
        <SaveIcon inprogress={false} />
      </IconButton>
    ),
  };
};

export default ManualGpsScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
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
