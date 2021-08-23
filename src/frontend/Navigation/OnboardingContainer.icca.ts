import { OnboardingStack } from "./OnboardingStack";
import IntroStack from "../screens/Intro";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

const RootStack = createSwitchNavigator(
  {
    Intro: IntroStack,
    Onboarding: OnboardingStack,
  },
  {
    initialRouteName: "Intro",
  }
);

export default createAppContainer(RootStack);
