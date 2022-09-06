import * as React from "react";
import { GestureResponderEvent, StyleSheet, View } from "react-native";
import { TouchableNativeFeedback } from "./Touchables";

import { VERY_LIGHT_BLUE } from "../lib/styles";
import type { ViewStyleProp } from "../types";

type Props = {
  children: React.ReactNode;
  onPress: ((event: GestureResponderEvent) => void) | (() => void);
  style?: ViewStyleProp;
  testID?: string;
};

const IconButton = ({ children, onPress, style, testID }: Props) => (
  <TouchableNativeFeedback
    testID={testID}
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, true)}
  >
    <View style={[styles.container, style]}>{children}</View>
  </TouchableNativeFeedback>
);

export default React.memo<Props>(IconButton);

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
