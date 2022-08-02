import * as React from "react";
import { AppStack, NavigatorScreenOptions, RootStack } from "./AppStack";

export const AppNavigator = () => {
  return (
    <RootStack.Navigator
      initialRouteName="Home"
      screenOptions={route => ({
        ...NavigatorScreenOptions,
        headerShown: route.route.name !== "Home",
      })}
    >
      {/* Refer to this issue for this odd syntax: https://github.com/react-navigation/react-navigation/issues/9578 */}
      {(() => AppStack())()}
    </RootStack.Navigator>
  );
};
