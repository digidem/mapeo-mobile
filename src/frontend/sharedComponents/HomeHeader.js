// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import IconButton from "../sharedComponents/IconButton";
import { ObservationListIcon, SyncIconCircle } from "../sharedComponents/icons";
import GpsPill from "../sharedComponents/GpsPill";

import type { NavigationScreenConfigProps } from "react-navigation";

const HomeHeader = (props: NavigationScreenConfigProps) => (
  <View style={styles.header}>
    <LinearGradient style={styles.linearGradient} colors={["#0006", "#0000"]} />
    <IconButton
      style={styles.leftButton}
      onPress={() => {
        props.navigation.navigate("SyncModal");
      }}
    >
      <SyncIconCircle />
    </IconButton>
    <GpsPill />
    <IconButton
      style={styles.rightButton}
      onPress={() => {
        props.navigation.navigate("ObservationList");
      }}
    >
      <ObservationListIcon />
    </IconButton>
  </View>
);

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    zIndex: 100,
    top: 0,
    right: 0,
    left: 0,
    height: 60,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  rightButton: {},
  leftButton: {
    width: 60,
    height: 60
  },
  linearGradient: {
    height: 60,
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: "transparent"
  }
});
