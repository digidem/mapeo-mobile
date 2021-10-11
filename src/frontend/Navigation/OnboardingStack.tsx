/**
 * Only reachable if the `onboarding` experiment is enabled
 * by doing either of the following:
 *   - Set `FEATURE_ONBOARDING=true` when running/building
 *   - Manually change the context value in `SettingsContext.tsx`
 */
import * as React from "react";
import { createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import { JoinRequestModal } from "../screens/JoinRequestModal";
import { ProjectInviteModal } from "../screens/ProjectInviteModal";
import {
  CreateOrJoinScreen,
  JoinProjectQrScreen,
  SendJoinRequestScreen,
  SyncOnboardingScreen,
} from "../screens/Onboarding";
import CustomHeaderLeft from "../sharedComponents/CustomHeaderLeft";
import { AppStack } from "./AppStack";

const CreateOrJoinStack = createStackNavigator(
  {
    CreateOrJoinScreen: CreateOrJoinScreen,
    JoinProjectQr: JoinProjectQrScreen,
    SendJoinRequest: SendJoinRequestScreen,
    Sync: SyncOnboardingScreen,
  },
  {
    initialRouteName: "CreateOrJoinScreen",
    // TODO iOS: Dynamically set transition mode to modal for modals
    mode: "card",
    headerMode: "screen",
    defaultNavigationOptions: {
      headerStyle: {
        height: 60,
      },
      // We use a slightly larger back icon, to improve accessibility
      // TODO iOS: This should probably be a chevron not an arrow
      headerLeft: props => <CustomHeaderLeft {...props} />,
      headerTitleStyle: {
        marginHorizontal: 0,
      },
      cardStyle: {
        backgroundColor: "#ffffff",
      },
    },
  }
);

const MainStack = createSwitchNavigator(
  {
    App: AppStack,
    CreateOrJoinStack,
  },
  {
    initialRouteName: "App",
  }
);

export const OnboardingStack = createStackNavigator(
  {
    Main: MainStack,
    JoinRequestModal,
    ProjectInviteModal,
  },
  {
    initialRouteName: "Main",
    mode: "modal",
    headerMode: "none",
  }
);
