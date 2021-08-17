import { createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import ProjectInviteModal from "../screens/ProjectInviteModal";
import { AppStack } from "./AppStack";
import { OnboardingStack } from "./OnboardingStack";

const MainStack = createSwitchNavigator(
  {
    App: AppStack,
    Onboarding: OnboardingStack,
  },
  {
    initialRouteName: "App",
  }
);

export const WithModalsStack = createStackNavigator(
  {
    Main: MainStack,
    ProjectInviteModal: {
      screen: ProjectInviteModal,
      path: "ProjectInviteModal/:invite",
    },
  },
  {
    initialRouteName: "Main",
    mode: "modal",
    headerMode: "none",
  }
);
