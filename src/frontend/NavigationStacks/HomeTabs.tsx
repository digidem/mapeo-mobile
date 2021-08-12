import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import MapScreen from "../screens/MapScreen";
import CameraScreen from "../screens/CameraScreen";
import HomeHeader from "../sharedComponents/HomeHeader";

type HomeTabsNavTypes = {
  Map: undefined;
  Camera: undefined;
};

const HomeTabs = createBottomTabNavigator<HomeTabsNavTypes>();

const HomeTabComponent = () => {
  return (
    <HomeTabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === "Map") iconName = "map";
          else iconName = "photo-camera";
          return <MaterialIcons name={iconName} size={30} color={color} />;
        },
        tabBarShowLabel: false,
        header: () => <HomeHeader />,
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
