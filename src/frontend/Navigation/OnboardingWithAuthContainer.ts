import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { AuthStack } from "./AuthStack";
import { OnboardingStack } from "./OnboardingStack";

const RootStack = createStackNavigator(
  {
    //Calling this app stack because it needs to have the same name as `DefaultWithAuthContainer`
    AppStack: OnboardingStack,
    AuthStack,
  },
  {
    mode: "modal",
    headerMode: "none",
  }
);

export const OnboardingWithAuthContainer = createAppContainer(RootStack);
