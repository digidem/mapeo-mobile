import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "../sharedComponents/Touchables";

const AddButton = ({ style, ...props }) => (
  <View style={[styles.container, style]}>
    <TouchableOpacity {...props}>
      <Image
        source={require("../images/add-button.png")}
        style={styles.button}
      />
    </TouchableOpacity>
  </View>
);

export default React.memo(AddButton);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
    bottom: 25,
    alignSelf: "center"
  },
  button: {
    width: 125,
    height: 125
  }
});
