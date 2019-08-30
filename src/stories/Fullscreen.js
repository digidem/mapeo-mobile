import React from "react";
import { View, Platform, StatusBar } from "react-native";

const sizeStyle =
  Platform.OS === "web"
    ? { width: "100vw", height: "100vh" }
    : { paddingTop: StatusBar.currentHeight, flex: 1 };

const FullScreen = ({ children, style }) =>
  Platform.OS === "web" ? (
    <View style={[style, sizeStyle]}>{children}</View>
  ) : (
    <View style={sizeStyle}>{children}</View>
  );

export default FullScreen;
