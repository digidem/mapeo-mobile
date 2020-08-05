// @flow
import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import type { LocationStatus } from "../../lib/utils";

const renderError = () => (
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

const renderIcon = (color = "#00FF02") => (
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
      return renderError();
    case "searching":
      return renderIcon("#0166FF");
    case "improving":
      return renderIcon("#00FF02");
    case "good":
    default:
      return renderIcon();
  }
};

export default React.memo<Props>(GpsIcon);
