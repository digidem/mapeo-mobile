import React from "react";
import { View } from "react-native";

const Progress = ({ size, color }) => (
  <View
    style={{
      backgroundColor: color,
      margin: 1.5,
      borderRadius: size / 2,
      width: size,
      height: size
    }}
  />
);

export default Progress;
