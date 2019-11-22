// @flow
import React from "react";
import { View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { DARK_MANGO, MANGO } from "../../lib/styles";

type Props = {
  inprogress?: boolean
};

export const SyncIcon = ({ color = "white" }: { color?: string }) => (
  <Icon
    color={color}
    name="bolt"
    size={20}
    style={{ transform: [{ rotate: "15deg" }] }}
  />
);

const SyncIconCircle = ({ inprogress }: Props) => (
  <View style={[styles.outerCircle, { opacity: inprogress ? 0.5 : 1 }]}>
    <View style={styles.innerCircle}>
      <SyncIcon />
    </View>
  </View>
);

export default SyncIconCircle;

const styles = StyleSheet.create({
  outerCircle: {
    width: 35,
    height: 35,
    backgroundColor: DARK_MANGO,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  innerCircle: {
    backgroundColor: MANGO,
    height: 30,
    width: 30,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"
  }
});
