import React from "react";
import { View, Platform } from "react-native";

const style =
  Platform.OS === "web" ? { width: "100vw", height: "100vh" } : undefined;

const FullScreen = ({ children }) =>
  Platform.OS === "web" ? <View style={style}>{children}</View> : children;

export default FullScreen;
