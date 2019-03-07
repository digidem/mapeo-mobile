import React from "react";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const ObservationListButton = ({ onPress }) => (
  <TouchableOpacity
    style={{
      width: 56,
      height: 56,
      flex: 1,
      justifyContent: "center",
      alignItems: "center"
    }}
    onPress={onPress}
  >
    <Icon name="photo-library" size={30} color="white" />
  </TouchableOpacity>
);

export default ObservationListButton;
