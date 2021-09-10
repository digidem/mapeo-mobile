import * as React from "react";
import { Image } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import api from "../../api";
import { IconSize, ViewStyleProp } from "../../sharedTypes";
import { Circle } from "../Circle";

const ICON_SIZES = {
  small: 22,
  medium: 35,
  large: 50,
} as const;

const RADII = {
  small: 15,
  medium: 25,
  large: 35,
} as const;

interface Props {
  size?: IconSize;
  style?: ViewStyleProp;
  iconId?: string;
}

export const CategoryIcon = React.memo(({ size = "medium", iconId }: Props) => {
  const [error, setError] = React.useState(false);
  const iconSize = ICON_SIZES[size] || 35;

  // Fallback to a default icon if we can't load the icon from mapeo-server
  if (error || !iconId) {
    return <MaterialIcon name="place" size={iconSize} />;
  }

  return (
    <Image
      style={{ width: iconSize, height: iconSize }}
      // @ts-expect-error
      source={{ uri: api.getIconUrl(iconId, size) }}
      onError={() => setError(true)}
    />
  );
});

export const CategoryCircleIcon = ({
  style,
  size = "medium",
  ...props
}: Props) => (
  <Circle radius={RADII[size]} style={style}>
    <CategoryIcon {...props} size={size} />
  </Circle>
);
