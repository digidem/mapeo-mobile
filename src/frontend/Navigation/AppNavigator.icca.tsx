import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { IccaStackNav } from "../screens/Intro";
import { AppStack } from "./AppStack";

export type IccaStackListRoot = {
  Icca: undefined;
  App: undefined;
};
const AppStackIcca = createNativeStackNavigator<IccaStackListRoot>();

export const AppNavigator = () => {
  return (
    <AppStackIcca.Navigator
      initialRouteName="Icca"
      screenOptions={() => ({ headerShown: false })}
    >
      <AppStackIcca.Screen name="Icca" component={IccaStackNav} />
      <AppStackIcca.Screen name="App" component={AppStack} />
    </AppStackIcca.Navigator>
  );
};
