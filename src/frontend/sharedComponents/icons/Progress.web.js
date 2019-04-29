import React from "react";
import { View } from "react-native";

const Progress = ({ size = 30, color = "white" }) => (
  <View
    style={{
      borderColor: color,
      borderWidth: 4,
      margin: 1.5,
      borderRadius: size / 2,
      width: size,
      height: size
    }}
  />
);

export default Progress;
