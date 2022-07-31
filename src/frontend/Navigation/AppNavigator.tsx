import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { AppStack } from "./AppStack";

export const AppNavigator = () => {
  const RootStack = createNativeStackNavigator();

  return (
    <RootStack.Navigator screenOptions={() => ({ headerShown: false })}>
      <RootStack.Screen name="App" component={AppStack} />
    </RootStack.Navigator>
  );
};
