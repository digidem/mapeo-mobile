import * as React from "react";
import { StyleSheet } from "react-native";

import { VERY_LIGHT_BLUE } from "../lib/styles";
import { ViewStyleProp } from "../sharedTypes";
import Text from "./Text";
import { TouchableNativeFeedback } from "./Touchables";

interface Props {
  containerStyle?: ViewStyleProp;
  onPress: () => void;
  textStyle?: ViewStyleProp;
  title: string;
}

const TextButton = ({ title, textStyle, containerStyle, onPress }: Props) => (
  <TouchableNativeFeedback
    style={[styles.buttonContainer, containerStyle]}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, true)}
    onPress={onPress}
  >
    <Text style={[styles.buttonText, textStyle]}>{title.toUpperCase()}</Text>
  </TouchableNativeFeedback>
);

export default TextButton;

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "blue",
    fontWeight: "700",
  },
});
