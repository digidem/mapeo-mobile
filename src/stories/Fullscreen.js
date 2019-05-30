import React from "react";
import { View, Platform } from "react-native";

const sizeStyle =
  Platform.OS === "web" ? { width: "100vw", height: "100vh" } : undefined;

const FullScreen = ({ children, style }) =>
  Platform.OS === "web" ? (
    <View style={[style, sizeStyle]}>{children}</View>
  ) : (
    children
  );

export default FullScreen;
