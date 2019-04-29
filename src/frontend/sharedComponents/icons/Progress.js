import React from "react";
import { Circle, CircleSnail } from "react-native-progress";

const Progress = ({ size, color, progress }) =>
  progress !== undefined ? (
    <Circle
      size={size}
      progress={progress}
      showsText
      color={color}
      strokeCap="round"
      direction="clockwise"
    />
  ) : (
    <CircleSnail
      size={size}
      color={color}
      strokeCap="round"
      direction="clockwise"
    />
  );

export default Progress;
