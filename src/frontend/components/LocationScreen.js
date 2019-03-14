// @flow

import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Constants } from "@unimodules/core";

import LocationContext from "../context/LocationContext";
import type { LocationContextType } from "../context/LocationContext";

const LocationScreen = ({ location }: { location: LocationContextType }) => (
  <LocationContext.Consumer>
    {location => (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          {JSON.stringify(location, null, 2)}
        </Text>
      </View>
    )}
  </LocationContext.Consumer>
);

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "left"
  }
});
