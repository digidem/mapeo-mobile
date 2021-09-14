import * as React from "react";
import { View, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NavigationProp } from "../types";
import IconButton from "./IconButton";
import { ObservationListIcon, SyncIconCircle } from "./icons";
import GpsPill from "./GpsPill";

const DEFAULT_HEIGHT = 60;

export const HomeHeader = ({ navigation }: { navigation: NavigationProp }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.header}>
      <LinearGradient
        style={[styles.linearGradient, { height: DEFAULT_HEIGHT + insets.top }]}
        colors={["#0006", "#0000"]}
      />
      <View
        style={[
          styles.buttonsContainer,
          {
            top: insets.top,
          },
        ]}
      >
        <IconButton
          style={styles.leftButton}
          onPress={() => {
            navigation.navigate("SyncModal");
          }}
        >
          <SyncIconCircle />
        </IconButton>
        <GpsPill
          onPress={() => {
            navigation.navigate("GpsModal");
          }}
        />
        <IconButton
          onPress={() => {
            navigation.navigate("ObservationList");
          }}
          testID="observationListButton"
        >
          <ObservationListIcon />
        </IconButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    zIndex: 100,
  },
  linearGradient: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: "transparent",
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftButton: {
    width: DEFAULT_HEIGHT,
    height: DEFAULT_HEIGHT,
  },
});
