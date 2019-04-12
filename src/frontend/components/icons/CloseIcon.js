// @flow
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

type Props = {
  size?: number
};

const CloseIcon = ({ size = 30 }: Props) => <Icon name="close" size={size} />;

export default CloseIcon;
