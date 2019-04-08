// @flow
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MEDIUM_GREY } from "../../lib/styles";

type Props = {
  size?: number
};

const CameraIcon = ({ size = 30 }: Props) => (
  <Icon color={MEDIUM_GREY} name="photo-camera" size={size} />
);

export default CameraIcon;
