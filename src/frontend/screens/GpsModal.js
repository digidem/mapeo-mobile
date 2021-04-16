// @flow
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import Text from "../sharedComponents/Text";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import LocationContext from "../context/LocationContext";
import useSettingsValue from "../hooks/useSettingsValue";

import { FormattedCoords } from "../sharedComponents/FormattedData";
import DateDistance from "../sharedComponents/DateDistance";
import HeaderTitle from "../sharedComponents/HeaderTitle";

import type { LocationContextType } from "../context/LocationContext";

const m = defineMessages({
  gpsHeader: {
    id: "screens.GpsModal.gpsHeader",
    defaultMessage: "Current GPS Location",
    description: "Header for GPS screen",
  },
  lastUpdate: {
    id: "screens.GpsModal.lastUpdate",
    defaultMessage: "Last update",
    description: "Section title for time of last GPS update",
  },
  utm: {
    id: "screens.GpsModal.locationUTM",
    defaultMessage: "Coordinates UTM",
    description: "Section title for UTM coordinates",
  },
  dms: {
    id: "screens.GpsModal.locationDMS",
    defaultMessage: "Coordinates DMS",
    description: "Section title for DMS coordinates",
  },
  dd: {
    id: "screens.GpsModal.locationDD",
    defaultMessage: "Coordinates Decimal Degrees",
    description: "Section title for DD coordinates",
  },
  details: {
    id: "screens.GpsModal.details",
    defaultMessage: "Details",
    description: "Section title for details about current position",
  },
  yes: {
    id: "screens.GpsModal.yes",
    defaultMessage: "Yes",
    description: "if a location sensor is active yes/no",
  },
  no: {
    id: "screens.GpsModal.no",
    defaultMessage: "No",
    description: "if a location sensor is active yes/no",
  },
  locationSensors: {
    id: "screens.GpsModal.locationSensors",
    defaultMessage: "Sensor Status",
    description: "Heading for section about location sensor status",
  },
});

const GpsModalRow = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

type Props = {
  navigation: any,
};

const GpsModal = ({ navigation }: Props) => {
  const location = React.useContext(LocationContext);
  // This is necessary for Flow type checking (if we use location.position in a
  // conditional it does not know if something else can change it)
  const { position, provider } = location;
  const coordinateFormat = useSettingsValue("coordinateFormat");
  const { formatMessage: t } = useIntl();

  return (
    <ScrollView style={styles.container} testID="gpsScreenScrollView">
      <View style={styles.infoArea}>
        <Text style={styles.sectionTitle}>
          <FormattedMessage {...m.lastUpdate} />
        </Text>
        <DateDistance
          style={styles.rowValue}
          date={new Date(getLastUpdateText(location))}
        />
        {position && (
          <>
            <Text style={styles.sectionTitle}>
              <FormattedMessage {...m[coordinateFormat]} />
            </Text>
            <Text style={styles.rowValue}>
              <FormattedCoords
                lon={position.coords.longitude}
                lat={position.coords.latitude}
                format={coordinateFormat}
              />
            </Text>
            <Text style={styles.sectionTitle}>
              <FormattedMessage {...m.details} />
            </Text>
            {Object.entries(position.coords).map(([key, value]) => (
              <GpsModalRow
                key={key}
                label={key}
                value={typeof value === "number" ? value.toFixed(5) : ""}
              />
            ))}
          </>
        )}
        {provider && (
          <>
            <Text style={styles.sectionTitle}>
              <FormattedMessage {...m.locationSensors} />
            </Text>
            {Object.entries(provider).map(([key, value]) => (
              <GpsModalRow
                key={key}
                label={key}
                value={value != null ? t(m.yes) : t(m.no)}
              />
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

GpsModal.navigationOptions = {
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "rgb(40,40,40)",
  },
  headerTitle: () => (
    <HeaderTitle style={{ color: "white" }}>
      <FormattedMessage {...m.gpsHeader} />
    </HeaderTitle>
  ),
};

export default GpsModal;

function getLastUpdateText(location: LocationContextType) {
  if (!location.savedPosition && !location.position) return "None";
  const lastTimestamp = location.position
    ? location.position.timestamp
    : // $FlowFixMe
      location.savedPosition.timestamp;
  return new Date(lastTimestamp).toLocaleString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(40,40,40)",
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  sectionTitle: {
    color: "white",
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
  },
  rowLabel: {
    color: "white",
    fontWeight: "700",
    minWidth: "50%",
  },
  rowValue: {
    color: "white",
    fontWeight: "400",
  },
  infoArea: {
    paddingLeft: 15,
    paddingRight: 15,
  },
});
