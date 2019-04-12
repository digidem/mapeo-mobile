// @flow
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

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
  onPress: (SyntheticEvent<>) => void,
  style?: any,
  children: React.Node
};

const IconButton = ({ onPress, style, children }: Props) => (
  <TouchableNativeFeedback testID="IconButton" onPress={onPress}>
    <View style={[styles.container, style]}>{children}</View>
  </TouchableNativeFeedback>
);

export default React.memo<Props>(IconButton);
