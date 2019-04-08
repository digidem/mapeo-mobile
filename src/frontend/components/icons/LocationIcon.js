// @flow
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MANGO } from "../../lib/styles";

type Props = {
  size?: number
};

const LocationIcon = ({ size = 30 }: Props) => (
  <Icon color={MANGO} name="my-location" size={size} />
);

export default LocationIcon;
