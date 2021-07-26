import AppStack from "./NavigationStacks/AppStack";
import { createAppContainer } from "react-navigation";
import { createSwitchNavigator } from "react-navigation";
import { OnboardingStack } from "./NavigationStacks/OnboardingStack";

export default createAppContainer(
  createSwitchNavigator(
    {
      Onboarding: OnboardingStack,
      App: AppStack,
    },
    {
      initialRouteName: "Onboarding",
    }
  )
);
