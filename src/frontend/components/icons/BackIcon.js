// @flow
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

type Props = {
  size?: number
};

const BackIcon = ({ size = 30 }: Props) => (
  <Icon name="arrow-back" size={size} />
);

export default BackIcon;
