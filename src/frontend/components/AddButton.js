import React from "react";
import { TouchableOpacity, Image } from "react-native";

const AddButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Image
      source={require("../images/add-button.png")}
      style={{
        width: 125,
        height: 125
      }}
    />
  </TouchableOpacity>
);

export default AddButton;
