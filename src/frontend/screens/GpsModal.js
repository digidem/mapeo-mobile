// @flow
import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

import IconButton from "../sharedComponents/IconButton";
import { CloseIcon } from "../sharedComponents/icons";
import LocationContext from "../context/LocationContext";
import FormattedCoords from "../sharedComponents/FormattedCoords";
import DateDistance from "../sharedComponents/DateDistance";
import { getLocationStatus } from "../lib/utils";
import type { LocationStatus } from "../lib/utils";
import type { LocationContextType } from "../context/LocationContext";

type HeaderProps = {
  onClose: () => void,
  variant: LocationStatus
};

const m = defineMessages({
  // Header for GPS screen
  gpsHeader: "Current GPS Location",
  // Section title for time of last GPS update
  lastUpdate: "Last update",
  // Section title for UTM coordinates
  locationUTM: "Coordinates UTM",
  // Section title for details about current position
  details: "Details",
  // "Yes" if a location sensor is active
  yes: "Yes",
  // "No" if a location sensor is active
  no: "No",
  // Heading for section about location sensor status
  locationSensors: "Sensor Status"
});

const GpsModalHeader = ({ onClose, variant }: HeaderProps) => (
  <View style={styles.header}>
    <IconButton onPress={onClose}>
      <CloseIcon color="white" />
    </IconButton>
    <FormattedMessage {...m.gpsHeader} numberOfLines={1} style={styles.title} />
  </View>
);

const GpsModalRow = ({ label, value }: { label: string, value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

type Props = {
  navigation: any
};

const GpsModal = ({ navigation }: Props) => {
  const location = React.useContext(LocationContext);
  const { formatMessage: t } = useIntl();

  return (
    <ScrollView style={styles.container}>
      <GpsModalHeader
        onClose={() => navigation.pop()}
        variant={getLocationStatus(location)}
      />
      <View style={styles.infoArea}>
        <FormattedMessage {...m.lastUpdate} style={styles.sectionTitle} />
        <DateDistance
          style={styles.rowValue}
          date={new Date(getLastUpdateText(location))}
        />
        {location.position && (
          <>
            <FormattedMessage {...m.locationUTM} style={styles.sectionTitle} />
            <FormattedCoords
              lon={location.position.coords.longitude}
              lat={location.position.coords.latitude}
              style={styles.rowValue}
            />
            <FormattedMessage {...m.details} style={styles.sectionTitle} />
            {Object.entries(location.position.coords).map(([key, value]) => (
              <GpsModalRow
                key={key}
                label={key}
                value={typeof value === "number" ? value.toFixed(5) : ""}
              />
            ))}
          </>
        )}
        {location.provider && (
          <>
            <FormattedMessage
              {...m.locationSensors}
              style={styles.sectionTitle}
            />
            {Object.entries(location.provider).map(([key, value]) => (
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
  header: {
    flex: 1,
    height: 60,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    color: "white",
    fontWeight: "700",
    fontSize: 20,
    flex: 1,
    textAlign: "center",
    marginRight: 60
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    flexDirection: "column"
  },
  row: {
    flexDirection: "row"
  },
  sectionTitle: {
    color: "white",
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16
  },
  rowLabel: {
    color: "white",
    fontWeight: "700",
    minWidth: "50%"
  },
  rowValue: {
    color: "white",
    fontWeight: "400"
  },
  infoArea: {
    paddingLeft: 15,
    paddingRight: 15
  }
});
