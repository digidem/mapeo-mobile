import { createAppContainer, createSwitchNavigator } from "react-navigation";
import IntroStack from "../screens/Intro";
import { OnboardingStack } from "./OnboardingStack";

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
