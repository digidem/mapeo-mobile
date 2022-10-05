import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import type { LocationStatus } from "../../lib/utils";

const RenderError = () => (
  <View
    style={{
      width: 22,
      height: 22,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: -2,
    }}
  >
    <View
      style={{
        backgroundColor: "white",
        width: 15,
        height: 15,
        borderRadius: 7,
      }}
    />
    <Icon
      name="error"
      color="#660000"
      size={22}
      style={{ position: "absolute" }}
    />
  </View>
);

const RenderIcon = ({ color = "#00FF02" }: { color?: string }) => (
  <View
    style={{
      backgroundColor: color,
      margin: 1.5,
      borderRadius: 7,
      width: 14,
      height: 14,
    }}
  />
);

type Props = { variant: LocationStatus };

const GpsIcon = ({ variant }: Props) => {
  switch (variant) {
    case "error":
      return <RenderError />;
    case "searching":
      return <RenderIcon color="#0166FF" />;
    case "improving":
      return <RenderIcon color="#00FF02" />;
    case "good":
    default:
      return <RenderIcon />;
  }
};

export default React.memo<Props>(GpsIcon);
