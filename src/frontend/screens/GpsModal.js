// @flow
import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";

import IconButton from "../sharedComponents/IconButton";
import { CloseIcon } from "../sharedComponents/icons";
import LocationContext from "../context/LocationContext";
import FormattedCoords from "../sharedComponents/FormattedCoords";

import { getLocationStatus } from "../lib/utils";
import type { LocationStatus } from "../lib/utils";
import type { LocationContextType } from "../context/LocationContext";

type HeaderProps = {
  onClose: () => void,
  variant: LocationStatus
};

const GpsModalHeader = ({ onClose, variant }: HeaderProps) => (
  <View style={styles.header}>
    <IconButton onPress={onClose}>
      <CloseIcon color="white" />
    </IconButton>
    <Text numberOfLines={1} style={styles.title}>
      Current Position
    </Text>
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

const GpsModal = ({ navigation }: Props) => (
  <LocationContext.Consumer>
    {location => (
      <ScrollView style={styles.container}>
        <GpsModalHeader
          onClose={() => navigation.pop()}
          variant={getLocationStatus(location)}
        />
        <View style={styles.infoArea}>
          <Text style={styles.sectionTitle}>Last Update</Text>
          <Text style={styles.rowValue}>{getLastUpdateText(location)}</Text>
          {location.position && (
            <>
              <Text style={styles.sectionTitle}>UTM Location</Text>
              <FormattedCoords
                lon={location.position.coords.longitude}
                lat={location.position.coords.latitude}
                style={styles.rowValue}
              />
              <Text style={styles.sectionTitle}>Position</Text>
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
              <Text style={styles.sectionTitle}>Provider</Text>
              {Object.entries(location.provider).map(([key, value]) => (
                <GpsModalRow
                  key={key}
                  label={key}
                  value={value ? "YES" : "NO"}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    )}
  </LocationContext.Consumer>
);

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
