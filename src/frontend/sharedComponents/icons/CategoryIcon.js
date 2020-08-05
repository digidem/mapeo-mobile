// @flow
import * as React from "react";
import { Image, View } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import Circle from "./Circle";
import api from "../../api";
import { type Style } from "../../types";
import type { IconSize } from "../../types";

type IconProps = {
  size?: IconSize,
  style?: Style<typeof View>,
  iconId?: string,
};

const iconSizes = {
  small: 22,
  medium: 35,
  large: 50,
};

const radii = {
  small: 15,
  medium: 25,
  large: 35,
};

export const CategoryIcon = React.memo<IconProps>(
  ({ size = "medium", iconId }) => {
    const [error, setError] = React.useState(false);
    const iconSize = iconSizes[size] || 35;
    // Fallback to a default icon if we can't load the icon from mapeo-server
    if (error || !iconId) {
      return <MaterialIcon name="place" size={iconSize} />;
    }
    return (
      <Image
        style={{ width: iconSize, height: iconSize }}
        source={{ uri: api.getIconUrl(iconId, size) }}
        onError={() => setError(true)}
      />
    );
  }
);

export const CategoryCircleIcon = ({
  style,
  size = "medium",
  ...props
}: IconProps) => {
  return (
    <Circle radius={radii[size]} style={style}>
      <CategoryIcon {...props} size={size} />
    </Circle>
  );
};
