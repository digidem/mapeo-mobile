/* eslint-disable react-native/no-unused-styles */
// @flow
import * as React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import Text from "./Text";
import { TouchableNativeFeedback } from "../sharedComponents/Touchables";

import { VERY_LIGHT_BLUE } from "../lib/styles";
import type { ViewStyleProp } from "../types";

// Fix warning pending https://github.com/kmagiera/react-native-gesture-handler/pull/561/files
TouchableNativeFeedback.propTypes = {
  ...TouchableNativeFeedback.propTypes,
  background: PropTypes.object,
};

type Props = {
  onPress: (SyntheticEvent<>) => any,
  children: string | React.Node,
  variant?: "contained" | "outlined" | "text",
  color?: "dark" | "light",
  style?: ViewStyleProp,
  fullWidth?: boolean,
  testID?: string,
  disabled?: boolean,
};

const Button = ({
  onPress,
  variant = "contained",
  color = "dark",
  style,
  children,
  fullWidth = false,
  disabled = false,
}: Props) => {
  const buttonStyle = styles["button" + capitalize(variant)];
  const textStyle =
    styles[
      "text" +
        capitalize(variant) +
        capitalize(color) +
        (disabled ? "Disabled" : "")
    ];
  return (
    <View
      style={[
        styles.buttonBase,
        buttonStyle,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <TouchableNativeFeedback
        disabled={disabled}
        background={TouchableNativeFeedback.Ripple(VERY_LIGHT_BLUE, false)}
        onPress={disabled ? undefined : onPress}
      >
        <View style={styles.touchable}>
          {
            typeof children === "string" ? (
              <Text style={[styles.textBase, textStyle]}>
                {children.toUpperCase()}
              </Text>
            ) : (
              children
            )
            // TODO: Handle <FormattedMessage> as children (wrapping in <Text>)
          }
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default Button;

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 6,
    alignSelf: "center",
    overflow: "hidden",
  },
  fullWidth: {
    width: "100%",
  },
  buttonContained: {
    backgroundColor: "#0066FF",
  },
  buttonOutlined: {
    borderColor: "#EEEEEE",
    borderWidth: 1.5,
  },
  touchable: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  textBase: {
    fontWeight: "700",
    letterSpacing: 0.5,
    fontSize: 16,
    color: "#FFFFFF",
  },
  textOutlinedLight: {
    color: "#0066FF",
  },
  textOutlinedDark: {
    color: "#0066FF",
  },
  textOutlinedLightDisabled: {
    color: "#666666",
  },
  textOutlinedDarkDisabled: {
    color: "#999999",
  },
});
