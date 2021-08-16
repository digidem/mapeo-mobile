import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import {
  CreateOrJoinScreen,
  JoinProjectQrScreen,
  SendJoinRequestScreen,
} from "../screens/Onboarding/";
import { SyncOnboardingScreen } from "../screens/Onboarding/Sync";
import CustomHeaderLeft from "../sharedComponents/CustomHeaderLeft";

export const OnboardingStack = createStackNavigator(
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
