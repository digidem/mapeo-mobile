import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import { AuthScreen } from "../screens/AuthScreen";
import { AuthLoading } from "../screens/AuthLoading";
import { AppStack } from "./AppStack";
import { OnboardingStack } from "./OnboardingStack";

//Route Name of Onboarding stack should match the name of App stack above^
const AuthOnboardingNavigator = createStackNavigator(
  {
    AuthLoading,
    AppStack: OnboardingStack,
    AuthStack: AuthScreen,
  },
  {
    initialRouteName: "AuthLoading",
    mode: "modal",
    headerMode: "none",
  }
);

export const OnboardingWithAuthContainer = createAppContainer(
  AuthOnboardingNavigator
);

const AuthDefaultNavigator = createStackNavigator(
  {
    AuthLoading,
    AppStack: AppStack,
    AuthStack: AuthScreen,
  },
  {
    initialRouteName: "AuthLoading",
    mode: "modal",
    headerMode: "none",
  }
);

export const DefaultWithAuthContainer = createAppContainer(
  AuthDefaultNavigator
);
