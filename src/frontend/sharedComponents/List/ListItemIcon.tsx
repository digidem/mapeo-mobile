import * as React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

interface Props extends ViewProps {
  iconName: string;
}

export const ListItemIcon = ({ iconName, ...other }: Props) => (
  <View style={styles.root} {...other}>
    <MaterialIcon name={iconName} size={24} color="rgba(0, 0, 0, 0.54)" />
  </View>
);

const styles = StyleSheet.create({
  root: {
    minWidth: 56,
    flexShrink: 0,
    justifyContent: "center",
  },
});
