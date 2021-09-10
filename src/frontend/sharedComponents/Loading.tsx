import * as React from "react";
import { Easing, StyleSheet, View } from "react-native";
import { DotIndicator } from "react-native-indicators";

const Loading = () => (
  <View style={styles.root}>
    <DotIndicator
      count={3}
      animationDuration={1500}
      size={10}
      animationEasing={Easing.ease}
    />
  </View>
);

export default Loading;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
});
