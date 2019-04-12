// @flow
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

type Props = {
  size?: number,
  color?: string
};

const CloseIcon = ({ size = 30, color }: Props) => (
  <Icon name="close" size={size} color={color} />
);

export default CloseIcon;
