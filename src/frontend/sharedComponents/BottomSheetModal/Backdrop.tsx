import * as React from "react";
import Animated, { Extrapolate, interpolate } from "react-native-reanimated";
import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

import { BLACK } from "../../lib/styles";

export const Backdrop = ({
  animatedIndex,
  style,
  ...rest
}: BottomSheetBackdropProps) => {
  //Use memo was causing a flickering effect when the backdrop was opened.
  const animatedOpacity = React.useRef(
    interpolate(animatedIndex, {
      inputRange: [0, 1],
      outputRange: [0, 0.3],
      extrapolate: Extrapolate.CLAMP,
    })
  );

  const containerStyle = React.useMemo(
    () => [
      style,
      {
        backgroundColor: BLACK,
        opacity: animatedOpacity.current,
      },
    ],
    [style, animatedOpacity.current]
  );

  return <Animated.View {...rest} style={containerStyle} />;
};
