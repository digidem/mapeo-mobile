/**
 * Only reachable if the `onboarding` experiment is enabled
 * by doing either of the following:
 *   - Set `FEATURE_ONBOARDING=true` when running/building
 *   - Manually change the context value in `SettingsContext.tsx`
 */
import * as React from "react";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";

import { JoinRequestModal } from "../screens/JoinRequestModal";
import { ProjectInviteModal } from "../screens/ProjectInviteModal";
import {
  CreateOrJoinScreen,
  JoinProjectQrScreen,
  SendJoinRequestScreen,
  SyncOnboardingScreen,
} from "../screens/Onboarding";
import { RootStack } from "./AppStack";
import { MODAL_NAVIGATION_OPTIONS } from "../sharedComponents/BottomSheetModal";

export type OnboardingStackList = {
  JoinProjectQrScreen: { isAdmin: boolean };
  CreateOrJoinScreen: undefined;
  SendJoinRequestScreen: undefined;
  SyncOnboardingScreen: { keepExistingObservations: boolean };
  ProjectInviteModal: { inviteKey: string };
  JoinRequestModal: { deviceName?: string; key?: string } | undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackList>();

export const OnboardingStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="CreateOrJoinScreen" component={CreateOrJoinScreen} />
    <Stack.Screen
      name="SendJoinRequestScreen"
      component={SendJoinRequestScreen}
    />
    <Stack.Screen
      name="SyncOnboardingScreen"
      component={SyncOnboardingScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="JoinProjectQrScreen" component={JoinProjectQrScreen} />
    {/* Modal Screen */}
    <Stack.Screen
      name="ProjectInviteModal"
      component={ProjectInviteModal}
      options={MODAL_NAVIGATION_OPTIONS}
    />
    {/* Modal Screen */}
    <Stack.Screen
      name="JoinRequestModal"
      component={JoinRequestModal}
      options={MODAL_NAVIGATION_OPTIONS}
    />
  </Stack.Navigator>
);
