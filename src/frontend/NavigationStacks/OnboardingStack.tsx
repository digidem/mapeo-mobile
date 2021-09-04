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
  >
    <Stack.Screen name="CreateOrJoinScreen" component={CreateOrJoinScreen} />
    <Stack.Screen name="JoinProjectQr" component={JoinProjectQrScreen} />
    <Stack.Screen name="SendJoinRequest" component={SendJoinRequestScreen} />
  </Stack.Navigator>;
};
