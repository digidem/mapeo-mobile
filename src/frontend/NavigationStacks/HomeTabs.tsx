import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapScreen from "../screens/MapScreen";
import CameraScreen from "../screens/CameraScreen";
import React from "react";
import HomeHeader from "../sharedComponents/HomeHeader";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

type HomeTabsNavTypes = {
  Map: undefined;
  Camera: undefined;
};

const HomeTabs = createBottomTabNavigator<HomeTabsNavTypes>();

const HomeTabComponent = () => {
  return (
    <HomeTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === "Map") iconName = "map";
          else iconName = "photo-camera";
          return <MaterialIcons name={iconName} size={30} color={color} />;
        },
        tabBarShowLabel: false,
        header: props => <HomeHeader {...props} />,
        headerTransparent: true,
        tabBarTestID: "tabBarButton" + route.name,
      })}
      initialRouteName="Map"
      backBehavior="initialRoute"
    >
      <HomeTabs.Screen name="Map" component={MapScreen} />
      <HomeTabs.Screen name="Camera" component={CameraScreen} />
    </HomeTabs.Navigator>
  );
};

export default HomeTabComponent;
