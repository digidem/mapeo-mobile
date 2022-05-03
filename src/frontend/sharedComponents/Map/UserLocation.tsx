import MapboxGL from "@react-native-mapbox-gl/maps";
import * as React from "react";
import { useExperiments } from "../../hooks/useExperiments";
interface UserLocationProps {
  visible: boolean;
  minDisplacement: number;
}

export const UserLocation = ({
  visible,
  minDisplacement,
}: UserLocationProps) => {
  const [{ directionalArrow }] = useExperiments();

  return (
    <MapboxGL.UserLocation
      visible={visible}
      minDisplacement={directionalArrow ? 1 : minDisplacement}
      showsUserHeadingIndicator={directionalArrow}
    />
  );
};
