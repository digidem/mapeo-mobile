import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import Text from "./Text";

const HeaderTitle = ({ children, style }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

const styles = StyleSheet.create({
  title: {
    ...Platform.select({
      ios: {
        fontSize: 17,
        fontWeight: "600",
        color: "rgba(0, 0, 0, .9)",
        marginHorizontal: 16,
      },
      android: {
        fontSize: 20,
        fontWeight: "700",
        color: "rgba(0, 0, 0, .9)",
        marginRight: 8,
      },
      default: {
        fontSize: 18,
        fontWeight: "400",
        color: "#3c4043",
      },
    }),
  },
});

export default HeaderTitle;
