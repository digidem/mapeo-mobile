// @flow
import React from "react";
import { Image } from "react-native";

type Props = {
  size?: number,
  style?: any
};

const ObservationListIcon = ({ size = 30, style }: Props) => (
  <Image
    source={require("../../images/observation-manager-icon.png")}
    style={[{ width: size, height: size }, style]}
  />
);

export default React.memo(ObservationListIcon);
