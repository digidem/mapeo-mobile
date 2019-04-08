// @flow
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

type Props = {
  size?: number
};

const UserIcon = ({ size = 30 }: Props) => (
  <Icon color="lightgray" name="user-circle-o" size={size} />
);

export default UserIcon;
