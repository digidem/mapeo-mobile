import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  CreateOrJoinScreen,
  JoinProjectQrScreen,
  SendJoinRequestScreen,
} from "../screens/Onboarding/";
import CustomHeaderLeft from "../sharedComponents/CustomHeaderLeft";

type OnboardingStackNavTypes = {
  CreateOrJoinScreen: undefined;
  JoinProjectQr: undefined;
  SendJoinRequest: undefined;
};

const Stack = createStackNavigator<OnboardingStackNavTypes>();

export const OnboardingStack = () => {
  <Stack.Navigator
    initialRouteName="CreateOrJoinScreen"
    screenOptions={({ route }) => ({
      presentation: "card",
      headerMode: "screen",
      // We use a slightly larger back icon, to improve accessibility
      // TODO iOS: This should probably be a chevron not an arrow
      headerStyle: { height: 60 },
      headerLeft: props => <CustomHeaderLeft {...props} />,
      headerTitleStyle: { marginHorizontal: 0 },
      cardStyle: { backgroundColor: "#ffffff" },
    })}
  ></Stack.Navigator>;
};

// export const OnboardingStack = createStackNavigator(
//   {
//     CreateOrJoinScreen: CreateOrJoinScreen,
//     JoinProjectQr: JoinProjectQrScreen,
//     SendJoinRequest: SendJoinRequestScreen,
//   },
//   {
//     initialRouteName: "CreateOrJoinScreen",
//     // TODO iOS: Dynamically set transition mode to modal for modals
//     mode: "card",
//     headerMode: "screen",
//     defaultNavigationOptions: {
//       headerStyle: {
//         height: 60,
//       },
//       // We use a slightly larger back icon, to improve accessibility
//       // TODO iOS: This should probably be a chevron not an arrow
//       headerLeft: props => <CustomHeaderLeft {...props} />,
//       headerTitleStyle: {
//         marginHorizontal: 0,
//       },
//       cardStyle: {
//         backgroundColor: "#ffffff",
//       },
//     },
//   }
// );
