import * as React from "react";
import { StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";

import { DARK_MANGO, MANGO } from "../../lib/styles";

interface Props {
  inprogress?: boolean;
}

export const SaveIcon = ({ inprogress }: Props) => (
  <View style={[styles.outerCircle, { opacity: inprogress ? 0.5 : 1 }]}>
    <View style={styles.innerCircle}>
      <Icon color="white" name="check" size={18} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  outerCircle: {
    width: 30,
    height: 30,
    backgroundColor: DARK_MANGO,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  innerCircle: {
    backgroundColor: MANGO,
    height: 25,
    width: 25,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});
