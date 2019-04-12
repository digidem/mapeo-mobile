import React from "react";
import { TouchableNativeFeedback, Image, StyleSheet, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    width: 30,
    height: 30
  }
});

const ObservationListButton = ({ onPress }) => (
  <TouchableNativeFeedback testID="ObservationListButton" onPress={onPress}>
    <View style={styles.container}>
      <Image
        source={require("../images/observation-manager-icon.png")}
        style={styles.icon}
      />
    </View>
  </TouchableNativeFeedback>
);

export default React.memo(ObservationListButton);
