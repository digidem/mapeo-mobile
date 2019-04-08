// @flow
import React from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { RED } from "../../lib/styles";

type Props = {
  size?: number
};

const AlertIcon = ({ size = 30 }: Props) => (
  <Icon color={RED} name="alert" size={size} />
);

export default AlertIcon;
