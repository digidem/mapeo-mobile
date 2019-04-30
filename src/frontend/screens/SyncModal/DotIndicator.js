import React from "react";
import { Easing } from "react-native";
import { DotIndicator } from "react-native-indicators";

const MyDotIndicator = () => (
  <DotIndicator
    count={3}
    color="white"
    animationDuration={1500}
    size={10}
    animationEasing={Easing.ease}
  />
);

export default MyDotIndicator;
