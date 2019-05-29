import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { TouchableNativeFeedback } from "../../sharedComponents/Touchables";

const NavButton = ({ name, onPress }) => (
  <TouchableNativeFeedback
    onPress={onPress}
    style={styles.iconCircle}
    background={TouchableNativeFeedback.Ripple("gray", true)}
  >
    <MaterialIcon name={name} size={30} />
  </TouchableNativeFeedback>
);

const QuestionNavBar = ({ current, total, onNext, onPrev }) => (
  <View style={styles.container}>
    <NavButton name="arrow-back" onPress={onPrev} />
    <Text numberOfLines={1} style={styles.text}>
      {current} of {total}
    </Text>
    <NavButton name="arrow-forward" onPress={onNext} />
  </View>
);

export default QuestionNavBar;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12.5,
    backgroundColor: "white",
    elevation: 5,
    zIndex: 1
  },
  text: {
    fontSize: 16
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2.5,
    borderColor: "#ECEFF0",
    alignItems: "center",
    justifyContent: "center"
  }
});
