// @flow
import * as React from "react";
import { View, Text, StyleSheet, Easing } from "react-native";
import { DotIndicator } from "react-native-indicators";

type Props = {
  // title: React.Node,
  // description: React.Node
};

const Loading = ({ title, description }: Props) => (
  <View style={styles.root}>
    <DotIndicator
      count={3}
      animationDuration={1500}
      size={10}
      animationEasing={Easing.ease}
    />
    {/** <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View> */}
  </View>
);

export default Loading;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center"
  }
  // title: {
  //   color: "white",
  //   fontWeight: "700",
  //   fontSize: 24
  // },
  // description: {
  //   color: "white",
  //   fontWeight: "400",
  //   fontSize: 20
  // },
  // textContainer: {
  //   maxWidth: "75%",
  //   marginLeft: 30
  // }
});
