// @flow
import React from "react";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import { Image, Text } from "react-native";

import { RED, DARK_GREY, MANGO, MEDIUM_GREY } from "../../lib/styles";
import type { Style } from "../../types";

type FontIconProps = {
  size?: number,
  color?: string,
  style?: Style<typeof Text>
};

type ImageIconProps = {
  size?: number,
  style?: Style<typeof Image>
};

export { default as GpsIcon } from "./GpsIcon";
export { CategoryIcon, CategoryCircleIcon } from "./CategoryIcon";
export { default as SaveIcon } from "./SaveIcon";
export { default as SyncIcon } from "./SyncIcon";

export const AlertIcon = ({ size = 30, color = RED, style }: FontIconProps) => (
  <MaterialCommunityIcon color={color} name="alert" size={size} style={style} />
);

export const CellphoneIcon = ({
  size = 30,
  color = "white",
  style
}: FontIconProps) => (
  <MaterialCommunityIcon
    color={color}
    name="cellphone-android"
    size={size}
    style={style}
  />
);

export const LaptopIcon = ({
  size = 30,
  color = "white",
  style
}: FontIconProps) => (
  <MaterialCommunityIcon
    color={color}
    name="laptop-windows"
    size={size}
    style={style}
  />
);

export const BackIcon = ({ size = 30, color, style }: FontIconProps) => (
  <MaterialIcon name="arrow-back" color={color} style={style} size={size} />
);

export const EditIcon = ({
  size = 30,
  color = DARK_GREY,
  style
}: FontIconProps) => (
  <MaterialIcon color={color} style={style} name="edit" size={size} />
);

export const LocationIcon = ({
  size = 30,
  color = MANGO,
  style
}: FontIconProps) => (
  <MaterialIcon color={color} style={style} name="my-location" size={size} />
);

export const WifiOffIcon = ({
  size = 30,
  color = "#490827",
  style
}: FontIconProps) => (
  <MaterialIcon
    color={color}
    style={style}
    name="signal-wifi-off"
    size={size}
  />
);

export const WifiIcon = ({
  size = 30,
  color = "white",
  style
}: FontIconProps) => (
  <MaterialIcon color={color} style={style} name="wifi" size={size} />
);

export const CloseIcon = ({ size = 30, color, style }: FontIconProps) => (
  <MaterialIcon name="close" size={size} color={color} style={style} />
);

export const CameraIcon = ({
  size = 30,
  color = MEDIUM_GREY,
  style
}: FontIconProps) => (
  <MaterialIcon color={color} style={style} name="photo-camera" size={size} />
);

export const UserIcon = ({
  size = 30,
  color = "lightgray",
  style
}: FontIconProps) => (
  <FontAwesomeIcon
    color={color}
    name="user-circle-o"
    size={size}
    style={style}
  />
);

export const ObservationListIcon = ({ size = 30, style }: ImageIconProps) => (
  <Image
    source={require("../../images/observation-manager-icon.png")}
    style={[{ width: size, height: size }, style]}
  />
);
