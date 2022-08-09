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
      screenOptions={NavigatorScreenOptions}
    >
      {/** NB: devExperiments not available in ICCA variant */}
      {createDefaultScreenGroup()}
      <RootStack.Group key="icca">
        <RootStack.Screen
          name="IccaIntro"
          component={Intro}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="IccaInfo"
          options={{ headerShown: false }}
          component={Info}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};
