import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";

const RootStack = createStackNavigator(
  {
    AuthStack,
    AppStack,
  },
  {
    mode: "modal",
    headerMode: "none",
  }
);

export const DefaultWithAuthContainer = createAppContainer(RootStack);
