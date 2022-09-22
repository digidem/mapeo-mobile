import * as React from "react";
import { StyleSheet, View } from "react-native";
import validateColor from "validate-color";

import { ViewStyleProp } from "../../types";

const BORDER_DEFAULTS = {
  color: "#EAEAEA",
  width: 1,
} as const;

interface Props
  extends React.PropsWithChildren<{
    color?: string;
    radius?: number;
    style?: ViewStyleProp;
  }> {}

const Circle = ({ children, color, radius = 25, style }: Props) => {
  const validColor = !!(color && validateColor(color));
  return (
    <View
      style={[
        styles.base,
        {
          borderColor: validColor ? color : BORDER_DEFAULTS.color,
          borderRadius: radius * 2,
          width: radius * 2,
          height: radius * 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default Circle;

const styles = StyleSheet.create({
  base: {
    width: 50,
    height: 50,
    borderWidth: BORDER_DEFAULTS.width,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowRadius: 5,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: "hidden",
  },
});
