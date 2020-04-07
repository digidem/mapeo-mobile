// @flow
import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar
} from "react-native";

import LocationContext from "../../context/LocationContext";
import FormattedCoords from "../../sharedComponents/FormattedCoords";
import DateDistance from "../../sharedComponents/DateDistance";
import HeaderTitle from "../../sharedComponents/HeaderTitle";

import type { LocationContextType } from "../../context/LocationContext";
import Scanner from "./Scanner";

const m = defineMessages({
  gpsHeader: {
    id: "screens.GpsModal.gpsHeader",
    defaultMessage: "Current GPS Location",
    description: "Header for GPS screen"
  },
  lastUpdate: {
    id: "screens.GpsModal.lastUpdate",
    defaultMessage: "Last update",
    description: "Section title for time of last GPS update"
  },
  locationUTM: {
    id: "screens.GpsModal.locationUTM",
    defaultMessage: "Coordinates UTM",
    description: "Section title for UTM coordinates"
  },
  details: {
    id: "screens.GpsModal.details",
    defaultMessage: "Details",
    description: "Section title for details about current position"
  },
  yes: {
    id: "screens.GpsModal.yes",
    defaultMessage: "Yes",
    description: "if a location sensor is active yes/no"
  },
  no: {
    id: "screens.GpsModal.no",
    defaultMessage: "No",
    description: "if a location sensor is active yes/no"
  },
  locationSensors: {
    id: "screens.GpsModal.locationSensors",
    defaultMessage: "Sensor Status",
    description: "Heading for section about location sensor status"
  }
});

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
      <StatusBar
        hidden
        animated
        translucent
        showHideTransition="fade"
        backgroundColor="transparent"
      />
      <View style={{ alignItems: "center" }}>
        <Scanner diameter={Dimensions.get("window").width - 20} />
      </View>
      <View style={styles.infoArea}>
        <Text style={styles.sectionTitle}>Ultima actualización</Text>
        <DateDistance
          style={styles.rowValue}
          date={new Date(getLastUpdateText(location))}
        />
        {location.position && (
          <>
            <Text style={styles.sectionTitle}>Ubicación UTM</Text>
            <FormattedCoords
              lon={location.position.coords.longitude}
              lat={location.position.coords.latitude}
              style={styles.rowValue}
            />
          </>
        )}
        {location.provider && (
          <>
            <Text style={styles.sectionTitle}>
              <FormattedMessage {...m.locationSensors} />
            </Text>
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

GpsModal.navigationOptions = {
  headerTintColor: "white",
  headerTransparent: true,
  headerStyle: {
    backgroundColor: "transparent"
  },
  headerTitle: null
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
    // ...StyleSheet.absoluteFill,
    // height: Dimensions.get("window").height,
    flex: 1,
    paddingTop: 6,
    backgroundColor: "rgb(40,40,40)",
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
