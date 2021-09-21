import * as React from "react";
import { StyleSheet, TouchableNativeFeedbackProps, View } from "react-native";

import { TouchableNativeFeedback } from "../Touchables";
import { VERY_LIGHT_BLUE } from "../../lib/styles";
import { ListContext } from "./ListContext";

interface Props extends React.PropsWithChildren<TouchableNativeFeedbackProps> {}

export const ListItem = ({ children, style, ...otherProps }: Props) => {
  const { dense } = React.useContext(ListContext);
  return (
    <TouchableNativeFeedback
      {...otherProps}
      background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}
    >
      <View style={[styles.root, dense && styles.dense, style]}>
        {children}
      </View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 0,
    justifyContent: "flex-start",
    flexDirection: "row",
    position: "relative",
    width: "100%",
    textAlign: "left",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dense: {
    paddingTop: 4,
    paddingBottom: 4,
  },
});
