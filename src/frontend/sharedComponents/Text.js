import React from "react";
import { Text as RNText } from "react-native";

export default function Text({ style, ...otherProps }) {
  return (
    <RNText style={[{ fontFamily: "Roboto" }].concat(style)} {...otherProps} />
  );
}
