import * as React from "react";
import { Animated } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { MAGENTA, MEDIUM_BLUE, MEDIUM_GREY } from "../../../lib/styles";

interface Props {
  animatedValue: Animated.Value;
  selected?: boolean;
  showError?: boolean;
}

export const AnimatedRadio = ({
  animatedValue,
  selected,
  showError,
}: Props) => {
  const animatedRadioStyles = React.useMemo(
    () => ({
      margin: 4,
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 1.2, 1],
          }),
        },
      ],
    }),
    [animatedValue]
  );

  return (
    <Animated.View style={animatedRadioStyles}>
      <MaterialIcon
        name={selected ? "radio-button-checked" : "radio-button-unchecked"}
        size={24}
        color={showError ? MAGENTA : selected ? MEDIUM_BLUE : MEDIUM_GREY}
      />
    </Animated.View>
  );
};
