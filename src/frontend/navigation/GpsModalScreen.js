import React from "react";
import { View, Text } from "react-native";

import IconButton from "../components/IconButton";
import CloseIcon from "../components/icons/CloseIcon";
import LocationContext from "../context/LocationContext";

const GpsModalScreen = ({ navigation }) => (
  <View
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.85)"
    }}
  >
    <IconButton onPress={() => navigation.pop()}>
      <CloseIcon color="white" />
    </IconButton>
    <LocationContext.Consumer>
      {location => {
        console.log("render");
        return (
          <Text style={{ color: "white" }}>
            {JSON.stringify(location, null, 2)}
          </Text>
        );
      }}
    </LocationContext.Consumer>
  </View>
);

export default GpsModalScreen;
