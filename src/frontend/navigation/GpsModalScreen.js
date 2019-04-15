// @flow
import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";

import IconButton from "../components/IconButton";
import CloseIcon from "../components/icons/CloseIcon";
import LocationContext from "../context/LocationContext";

import { getLocationStatus } from "../lib/utils";
import type { LocationStatus } from "../lib/utils";

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
    backgroundColor: "red",
    flex: 1,
    textAlign: "center",
    marginRight: 60
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    flexDirection: "column"
  }
});

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

type Props = {
  navigation: any
};

const GpsModalScreen = ({ navigation }: Props) => (
  <LocationContext.Consumer>
    {location => (
      <ScrollView style={styles.container}>
        <GpsModalHeader
          onClose={() => navigation.pop()}
          variant={getLocationStatus(location)}
        />
        <Text style={{ color: "white" }}>
          {JSON.stringify(location, null, 2)}
        </Text>
      </ScrollView>
    )}
  </LocationContext.Consumer>
);

export default GpsModalScreen;
