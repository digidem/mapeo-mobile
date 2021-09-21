import * as React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

import Text from "../Text";

interface Props extends ViewProps {
  primary?: React.ReactNode;
  secondary?: React.ReactNode;
}

export const ListItemText = ({
  style,
  primary,
  secondary,
  ...other
}: Props) => (
  <View
    style={[styles.root, primary && secondary ? styles.multiline : undefined]}
    {...other}
  >
    <Text style={styles.primary}>{primary}</Text>
    {secondary && <Text style={styles.secondary}>{secondary}</Text>}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: 4,
    marginBottom: 4,
  },
  multiline: {
    marginTop: 6,
    marginBottom: 6,
  },
  primary: {
    fontSize: 16,
    lineHeight: 1.5 * 16,
    color: "rgba(0, 0, 0, 0.87)",
  },
  secondary: {
    fontSize: 14,
    lineHeight: 1.43 * 14,
    color: "rgba(0, 0, 0, 0.54)",
  },
});
