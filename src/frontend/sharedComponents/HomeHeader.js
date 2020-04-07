// @flow
import React from "react";
import { View, StyleSheet, StatusBar, SafeAreaView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "react-navigation-hooks";

import IconButton from "../sharedComponents/IconButton";
import { ObservationListIcon, SyncIconCircle } from "../sharedComponents/icons";
import GpsPill from "../sharedComponents/GpsPill";

const HomeHeader = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.header}>
      <StatusBar
        animated
        translucent
        showHideTransition="fade"
        backgroundColor="transparent"
      />
      <LinearGradient
        style={styles.linearGradient}
        colors={["#0006", "#0000"]}
      />
      <IconButton
        style={styles.leftButton}
        onPress={() => {
          navigation.navigate("SyncModal");
        }}>
        <SyncIconCircle />
      </IconButton>
      <GpsPill />
      <IconButton
        style={styles.rightButton}
        onPress={() => {
          navigation.navigate("ObservationList");
        }}>
        <ObservationListIcon />
      </IconButton>
    </SafeAreaView>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    marginTop: 16,
    zIndex: 100,
    height: 60,
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
    height: 84,
    position: "absolute",
    top: -24,
    right: 0,
    left: 0,
    backgroundColor: "transparent"
  }
});
