import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { AppStack } from "./AppStack";
import { createStackNavigator } from "react-navigation-stack";
import { AuthScreen } from "../screens/AuthScreen";
import { OnboardingStack } from "./OnboardingStack";
import { AuthLoading } from "../screens/AuthLoading";
import DefaultContainer from "./DefaultContainer";
import OnboardingContainer from "./OnboardingContainer";
import AppContainerWrapper from "../AppContainerWrapper";
const AuthStack = createStackNavigator({ AuthScreen }, { headerMode: "none" });

// const DefaultWithAuthNavigator = createSwitchNavigator(
//     {
//         AuthLoading,
//         AppStack:DefaultContainer,
//         AuthStack
//     },
//     {
//         initialRouteName:'AuthLoading',

//     }
// )

// export const DefaultWithAuthContainer = createAppContainer(DefaultWithAuthNavigator)

//Route Name of Onboarding stack should match the name of App stack above^
const AuthNavigator = createSwitchNavigator(
  {
    AuthLoading,
    AppStack: AppContainerWrapper,
    AuthStack,
  },
  {
    initialRouteName: "AuthLoading",
    resetOnBlur: false,
  }
);

export const AuthContainer = createAppContainer(AuthNavigator);
