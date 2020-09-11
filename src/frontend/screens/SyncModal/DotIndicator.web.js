import React from "react";
import { View, StyleSheet } from "react-native";

const MyDotIndicator = () => (
  <View style={styles.container}>
    <View style={styles.dot} />
    <View style={styles.dot} />
    <View style={styles.dot} />
  </View>
);

export default MyDotIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 50,
  },
  dot: {
    width: 10,
    borderRadius: 5,
    height: 10,
    backgroundColor: "white",
  },
});
