import MapboxGL from "@react-native-mapbox-gl/maps";
import * as React from "react";
import useSettingsValue from "../../hooks/useSettingsValue";

interface UserLocationProps {
  visible: boolean;
  minDisplacement: number;
}

export const UserLocation = ({
  visible,
  minDisplacement,
}: UserLocationProps) => {
  const directionalArrow = useSettingsValue("directionalArrow") as boolean;

  return (
    <MapboxGL.UserLocation
      visible={visible}
      minDisplacement={directionalArrow ? 1 : minDisplacement}
      showsUserHeadingIndicator={directionalArrow}
    />
  );
};
