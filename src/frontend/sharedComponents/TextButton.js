// @flow
import * as React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import Text from "./Text";
import { TouchableNativeFeedback } from "../sharedComponents/Touchables";

import { VERY_LIGHT_BLUE } from "../lib/styles";
import type { ViewStyleProp } from "../types";

// Fix warning pending https://github.com/kmagiera/react-native-gesture-handler/pull/561/files
TouchableNativeFeedback.propTypes = {
  ...TouchableNativeFeedback.propTypes,
  background: PropTypes.object,
};

type Props = {
  onPress: (SyntheticEvent<>) => any,
  containerStyle?: ViewStyleProp,
  textStyle?: ViewStyleProp,
  title: string,
  testID?: string,
};

const TextButton = ({
  onPress,
  containerStyle,
  textStyle,
  title,
  testID,
}: Props) => (
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
