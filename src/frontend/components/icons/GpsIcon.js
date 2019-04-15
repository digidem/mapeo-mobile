// @flow
import React from "react";
import { View } from "react-native";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/MaterialIcons";

import type { Variant } from "../GpsPill";

const renderError = () => (
  <View
    style={{
      width: 22,
      height: 22,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: -2
    }}
  >
    <View
      style={{
        backgroundColor: "white",
        width: 15,
        height: 15,
        borderRadius: 7
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
const renderProgress = (color: string) => (
  <Progress.CircleSnail
    size={22}
    indeterminate
    color={color}
    strokeCap="round"
    direction="clockwise"
  />
);
const renderGood = () => (
  <View
    style={{
      backgroundColor: "#00FF02",
      margin: 1.5,
      borderRadius: 7,
      width: 14,
      height: 14
    }}
  />
);

type Props = { variant: Variant };

const GpsIcon = ({ variant }: Props) => {
  switch (variant) {
    case "error":
      return renderError();
    case "searching":
      return renderProgress("#0166FF");
    case "improving":
      return renderProgress("#00FF02");
    case "good":
    default:
      return renderGood();
  }
};

export default React.memo<Props>(GpsIcon);
