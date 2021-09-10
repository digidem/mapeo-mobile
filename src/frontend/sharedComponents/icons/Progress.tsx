import * as React from "react";
import { Circle, CircleSnail } from "react-native-progress";

interface Props {
  color?: string;
  progress?: number;
  size?: number;
}

export const Progress = ({ size, color, progress }: Props) =>
  progress !== undefined && progress < 1 ? (
    <Circle
      size={size}
      progress={progress}
      color={color}
      strokeCap="butt"
      direction="clockwise"
      borderWidth={0}
      thickness={3}
    />
  ) : (
    <CircleSnail
      size={size ? size + 6 : undefined}
      color={color}
      strokeCap="round"
      direction="clockwise"
    />
  );
