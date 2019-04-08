// @flow
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { DARK_GREY } from "../../lib/styles";

type Props = {
  size?: number
};

const EditIcon = ({ size = 30 }: Props) => (
  <Icon color={DARK_GREY} name="edit" size={size} />
);

export default EditIcon;
