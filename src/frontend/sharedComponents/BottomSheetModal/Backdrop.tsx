import * as React from "react";
import Animated, { Extrapolate, interpolate } from "react-native-reanimated";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

import { BLACK } from "../../lib/styles";

export const Backdrop = ({
  animatedIndex,
  style,
  ...rest
}: BottomSheetBackdropProps) => {
  //Causing flashing when opening the bottom sheet

  // const animatedOpacity = React.useMemo(
  //   () =>
  //     interpolate(animatedIndex, {
  //       inputRange: [0, 1],
  //       outputRange: [0.1, 0.3],
  //       extrapolate: Extrapolate.CLAMP,
  //     }),
  //   [animatedIndex])

  const containerStyle = React.useMemo(
    () => [
      style,
      {
        backgroundColor: BLACK,
        opacity: 0.3,
      },
    ],
    [style, animatedIndex]
  );

  return <Animated.View {...rest} style={containerStyle} />;
};
