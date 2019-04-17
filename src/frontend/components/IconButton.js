// @flow
import * as React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

import { VERY_LIGHT_BLUE } from "../lib/styles";

// Fix warning pending https://github.com/kmagiera/react-native-gesture-handler/pull/561/files
TouchableNativeFeedback.propTypes = {
  ...TouchableNativeFeedback.propTypes,
  background: PropTypes.object
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    flex: 0,
    justifyContent: "center",
    alignItems: "center"
  }
});

type Props = {
  onPress: (SyntheticEvent<>) => any,
  style?: any,
  children: React.Node,
  testID?: string
};

const IconButton = ({ onPress, style, children, testID }: Props) => (
  <TouchableNativeFeedback
    testID={testID}
    onPress={onPress}
    background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, true)}
  >
    <View style={[styles.container, style]}>{children}</View>
  </TouchableNativeFeedback>
);

export default React.memo<Props>(IconButton);
