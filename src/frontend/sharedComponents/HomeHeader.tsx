import * as React from "react";
import { View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

import { AppStackNavTypes } from "../NavigationStacks/AppStack";
import IconButton from "./IconButton";
import { ObservationListIcon, SyncIconCircle } from "./icons";
import GpsPill from "./GpsPill";

const HomeHeader = () => {
  const navigation = useNavigation<StackNavigationProp<AppStackNavTypes>>();
  return (
    <View style={styles.header}>
      <LinearGradient
        style={styles.linearGradient}
        colors={["#0006", "#0000"]}
      />
      <View style={styles.interactiveContainer}>
        <IconButton
          style={styles.leftButton}
          onPress={() => navigation.navigate("SyncModal")}
        >
          <SyncIconCircle />
        </IconButton>
        <GpsPill onPress={() => navigation.navigate("GpsModal")} />
        <IconButton
          style={styles.rightButton}
          onPress={() => navigation.navigate("ObservationList")}
          testID="observationListButton"
        >
          <ObservationListIcon />
        </IconButton>
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    zIndex: 100,
    height: 60,
    top: 0,
    right: 0,
    left: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  interactiveContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightButton: {},
  leftButton: {
    width: 60,
    height: 60,
  },
  linearGradient: {
    position: "absolute",
    height: "100%",
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: "transparent",
  },
});
