import * as React from "react";
import { Text as RNText, TextProps } from "react-native";

const Text = ({
  children,
  style,
  ...otherTextProps
}: React.PropsWithChildren<TextProps>) => (
  <RNText style={[{ fontFamily: "Roboto" }, style]} {...otherTextProps}>
    {children}
  </RNText>
);

export default Text;
