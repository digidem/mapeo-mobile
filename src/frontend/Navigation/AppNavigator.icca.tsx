import * as React from "react";
import { Intro, Info } from "../screens/Intro";
import {
  createDefaultScreenGroup,
  NavigatorScreenOptions,
  RootStack,
} from "./AppStack";

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
      {/** NB: devExperiments not available in ICCA variant */}
      {createDefaultScreenGroup()}
      <RootStack.Group key="icca">
        <RootStack.Screen
          name="IccaIntro"
          component={Intro}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="IccaInfo" component={Info} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};
