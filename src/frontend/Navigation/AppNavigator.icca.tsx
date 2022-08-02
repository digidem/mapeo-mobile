import * as React from "react";
import { IccaStackNav } from "../screens/Intro";
import { AppStack, NavigatorScreenOptions, RootStack } from "./AppStack";

export const AppNavigator = () => {
  return (
    <RootStack.Navigator
      initialRouteName="IccaIntro"
      screenOptions={route => ({
        ...NavigatorScreenOptions,
        headerShown: !(
          route.route.name === "Home" ||
          route.route.name === "IccaIntro" ||
          route.route.name === "IccaInfo"
        ),
      })}
    >
      {/* Refer to this issue for this odd syntax: https://github.com/react-navigation/react-navigation/issues/9578 */}
      {(() => AppStack())()}
      {(() => IccaStackNav())()}
    </RootStack.Navigator>
  );
};
