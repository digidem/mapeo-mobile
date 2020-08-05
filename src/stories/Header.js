// @flow
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CloseIcon } from "../frontend/sharedComponents/icons";
import IconButton from "../frontend/sharedComponents/IconButton";

type Props = {
  title: string,
  onClosePress: () => any,
};

const Header = ({ title, onClosePress }: Props) => (
  <View style={styles.container}>
    <IconButton onPress={onClosePress}>
      <CloseIcon />
    </IconButton>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default Header;

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    flexShrink: 1,
    height: 60,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
});
