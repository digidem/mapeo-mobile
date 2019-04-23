// @flow
import React from "react";
import { Image } from "react-native";
import type { Style } from "../../types/other";

type Props = {
  size?: number,
  style?: Style<typeof Image>
};

const ObservationListIcon = ({ size = 30, style }: Props) => (
  <Image
    source={require("../../images/observation-manager-icon.png")}
    style={[{ width: size, height: size }, style]}
  />
);

export default React.memo<Props>(ObservationListIcon);
