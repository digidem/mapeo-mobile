import React from "react";
import { Easing } from "react-native";
import { DotIndicator } from "react-native-indicators";

const MyDotIndicator = ({ size, style }) => (
  <DotIndicator
    count={3}
    color="white"
    animationDuration={1500}
    size={size || 10}
    animationEasing={Easing.ease}
    style={style}
  />
);

export default MyDotIndicator;
