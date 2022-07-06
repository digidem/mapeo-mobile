/**
 * Only reachable if the `onboarding` experiment is enabled
 * by doing either of the following:
 *   - Set `FEATURE_ONBOARDING=true` when running/building
 *   - Manually change the context value in `SettingsContext.tsx`
 */
import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { JoinRequestModal } from "../screens/JoinRequestModal";
import { ProjectInviteModal } from "../screens/ProjectInviteModal";
import {
  CreateOrJoinScreen,
  JoinProjectQrScreen,
  SendJoinRequestScreen,
  SyncOnboardingScreen,
} from "../screens/Onboarding";
import { RootStack } from "./AppStack";

export type OnboardingStackList = {
  JoinProjectQrScreen: { isAdmin: boolean };
  CreateOrJoinScreen: undefined;
  SendJoinRequestScreen: undefined;
  SyncOnboardingScreen: { keepExistingObservations: boolean };
  ProjectInviteModal: { inviteKey: string };
  JoinRequestModal: { deviceName?: string; key?: string } | undefined;
};

export const OnboardingStack = () => (
  <>
    <RootStack.Screen
      name="CreateOrJoinScreen"
      component={CreateOrJoinScreen}
    />
    <RootStack.Screen
      name="SendJoinRequestScreen"
      component={SendJoinRequestScreen}
    />
    <RootStack.Screen
      name="SyncOnboardingScreen"
      component={SyncOnboardingScreen}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="JoinProjectQrScreen"
      component={JoinProjectQrScreen}
    />
    {/* Modal Screen */}
    <RootStack.Screen
      name="ProjectInviteModal"
      component={ProjectInviteModal}
      options={{ presentation: "transparentModal" }}
    />
    {/* Modal Screen */}
    <RootStack.Screen
      name="JoinRequestModal"
      component={JoinRequestModal}
      options={{ presentation: "transparentModal" }}
    />
  </>
);
