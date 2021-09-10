import * as React from "react";
import { Image } from "react-native";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { DARK_GREY, MEDIUM_GREY, RED } from "../../lib/styles";
import { TextStyleProp, ImageStyleProp } from "../../sharedTypes";
import { Circle } from "../Circle";

export { GpsIcon } from "./GpsIcon";
export { CategoryIcon, CategoryCircleIcon } from "./CategoryIcon";
export { SaveIcon } from "./SaveIcon";
export { SyncIcon, SyncIconCircle } from "./SyncIcon";

interface FontIconProps {
  size?: number;
  color?: string;
  style?: TextStyleProp;
}

interface ImageIconProps {
  size?: number;
  style?: ImageStyleProp;
}

export const AlertIcon = ({ size = 30, color = RED, style }: FontIconProps) => (
  <MaterialCommunityIcon color={color} name="alert" size={size} style={style} />
);

export const SettingsIcon = ({ size = 30, color, style }: FontIconProps) => (
  <MaterialIcon color={color} name="settings" size={size} style={style} />
);

export const CellphoneIcon = ({
  size = 30,
  color = "white",
  style,
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
  style,
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

export const ErrorIcon = ({
  size = 30,
  color = "#660000",
  style,
}: FontIconProps) => (
  <MaterialIcon
    name="error"
    color={color}
    size={size}
    style={[{ position: "absolute" }, style]}
  />
);

export const EditIcon = ({
  size = 30,
  color = DARK_GREY,
  style,
}: FontIconProps) => (
  <MaterialIcon color={color} style={style} name="edit" size={size} />
);

export const DetailsIcon = ({
  size = 30,
  color = DARK_GREY,
  style,
}: FontIconProps) => (
  <MaterialIcon
    color={color}
    style={style}
    name="format-list-bulleted"
    size={size}
  />
);

export const DoneIcon = ({
  size = 30,
  color = "white",
  style,
}: FontIconProps) => (
  <MaterialIcon color={color} style={style} name="check" size={size} />
);

export const WifiOffIcon = ({
  size = 30,
  color = "#490827",
  style,
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
  style,
}: FontIconProps) => (
  <MaterialIcon color={color} style={style} name="wifi" size={size} />
);

export const CloseIcon = ({ size = 30, color, style }: FontIconProps) => (
  <MaterialIcon name="close" size={size} color={color} style={style} />
);

export const CameraIcon = ({
  size = 30,
  color = MEDIUM_GREY,
  style,
}: FontIconProps) => (
  <MaterialIcon color={color} style={style} name="photo-camera" size={size} />
);

export const ObservationListIcon = ({ size = 30, style }: ImageIconProps) => (
  <Image
    source={require("../../images/observation-manager-icon.png")}
    style={[{ width: size, height: size }, style]}
  />
);

export const LocationNoFollowIcon = ({
  size = 30,
  color = MEDIUM_GREY,
}: FontIconProps) => (
  <Circle radius={25}>
    <MaterialIcon color={color} name="location-searching" size={size} />
  </Circle>
);

export const LocationFollowingIcon = ({
  size = 30,
  color = "#4A90E2",
}: FontIconProps) => (
  <Circle radius={25}>
    <MaterialIcon color={color} name="my-location" size={size} />
  </Circle>
);
