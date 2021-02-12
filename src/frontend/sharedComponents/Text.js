import React from "react";
import { Text as RNText } from "react-native";

export default function Text({ style, children, ...otherProps }) {
  return (
    <RNText style={[{ fontFamily: "Roboto" }].concat(style)} {...otherProps}>
      {children}
    </RNText>
  );
}
