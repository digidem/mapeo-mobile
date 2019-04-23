import React from "react";
import { View, StyleSheet } from "react-native";

const InsetMapView = ({ style }) => <View style={[style, styles.container]} />;

export default InsetMapView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightgray"
  }
});
