import * as React from "react";
import Animated, { Extrapolate, interpolate } from "react-native-reanimated";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

import { BLACK } from "../../lib/styles";

export const Backdrop = ({
  animatedIndex,
  style,
}: BottomSheetBackdropProps) => {
  const animatedOpacity = React.useMemo(
    () =>
      interpolate(animatedIndex, {
        inputRange: [0, 1],
        outputRange: [0, 0.3],
        extrapolate: Extrapolate.CLAMP,
      }),
    [animatedIndex]
  );

  const containerStyle = React.useMemo(
    () => [
      style,
      {
        backgroundColor: BLACK,
        opacity: animatedOpacity,
      },
    ],
    [style, animatedOpacity]
  );

  return <Animated.View style={containerStyle} />;
};
