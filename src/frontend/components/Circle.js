// @flow
import * as React from "react";
import { StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  circle: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 50,
    borderColor: "#EAEAEA",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowRadius: 5,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3
  }
});

type Props = {
  radius?: number,
  children: React.Node
};

const Circle = ({ radius = 25, children }: Props) => (
  <View
    style={[
      styles.circle,
      {
        width: radius * 2,
        height: radius * 2,
        borderRadius: radius * 2
      }
    ]}
  >
    {children}
  </View>
);

export default Circle;
