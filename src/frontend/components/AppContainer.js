import React from "react";
import { Text, View } from "react-native";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import LocationScreen from "./LocationScreen";

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Settings!</Text>
      </View>
    );
  }
}

const TabNavigator = createBottomTabNavigator({
  Home: LocationScreen,
  Settings: SettingsScreen
});

export default createAppContainer(TabNavigator);
