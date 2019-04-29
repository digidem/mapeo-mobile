import React from "react";
import { Circle, CircleSnail } from "react-native-progress";

const Progress = ({ size, color, progress }) =>
  progress !== undefined ? (
    <Circle
      size={size}
      progress={progress}
      color={color}
      strokeCap="butt"
      direction="clockwise"
      borderWidth={0}
      thicknes={3}
    />
  ) : (
    <CircleSnail
      size={size + 6}
      color={color}
      strokeCap="round"
      direction="clockwise"
    />
  );

export default Progress;
