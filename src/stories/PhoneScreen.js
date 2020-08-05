// @flow
import * as React from "react";
import { View, StyleSheet } from "react-native";

/**
 * Layout component used in docs (sized to phone screen)
 */
const PhoneScreen = ({ children }: { children: React.Node }) => (
  <View style={styles.container}>{children}</View>
);

export default PhoneScreen;

const styles = StyleSheet.create({
  container: {
    width: 360,
    height: 640,
    borderColor: "#00000",
    borderWidth: 1,
  },
});
