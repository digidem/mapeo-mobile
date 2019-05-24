// @flow
import React from "react";
import { View, StyleSheet } from "react-native";

import { RED, WHITE } from "../../lib/styles";

type Props = {
  inprogress?: boolean
};

const DeleteIcon = ({ inprogress }: Props) => (
  <View style={[styles.button, { opacity: inprogress ? 0.5 : 1 }]}>
    Delete
  </View>
);


export default DeleteIcon;

const styles = StyleSheet.create({
  button: {
    backgroundColor: RED,
    color: WHITE,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"
  },
});
