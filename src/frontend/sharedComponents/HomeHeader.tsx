import * as React from "react";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

import { ObservationListIcon, SyncIconCircle } from "./icons";
import { StackScreenComponent } from "../sharedTypes";
import GpsPill from "./GpsPill";
import IconButton from "./IconButton";

const HomeHeader: StackScreenComponent = ({ navigation }) => (
  <View style={styles.header}>
    <LinearGradient style={styles.linearGradient} colors={["#0006", "#0000"]} />
    <IconButton
      style={styles.leftButton}
      onPress={() => navigation.navigate("SyncModal")}
    >
      <SyncIconCircle />
    </IconButton>
    <GpsPill onPress={() => navigation.navigate("GpsModal")} />
    <IconButton
      onPress={() => navigation.navigate("ObservationList")}
      testID="observationListButton"
    >
      <ObservationListIcon />
    </IconButton>
  </View>
);

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    zIndex: 100,
    top: 0,
    right: 0,
    left: 0,
    height: 60,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftButton: {
    width: 60,
    height: 60,
  },
  linearGradient: {
    height: 60,
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: "transparent",
  },
});
