import React from "react";
import { CircleSnail } from "react-native-progress";

const Progress = ({ size, color }) => (
  <CircleSnail
    size={size}
    indeterminate
    color={color}
    strokeCap="round"
    direction="clockwise"
  />
);

export default Progress;
