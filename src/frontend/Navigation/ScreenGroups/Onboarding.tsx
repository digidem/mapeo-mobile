import * as React from "react";
import { MessageDescriptor } from "react-intl";
import { MEDIUM_BLUE, WHITE } from "../../lib/styles";
import { JoinRequestModal } from "../../screens/JoinRequestModal";
import {
  CreateOrJoinScreen,
  SendJoinRequestScreen,
  SyncOnboardingScreen,
  JoinProjectQrScreen,
} from "../../screens/Onboarding";
import { ProjectInviteModal } from "../../screens/ProjectInviteModal";
import { MODAL_NAVIGATION_OPTIONS } from "../../sharedComponents/BottomSheetModal";
import CustomHeaderLeft from "../../sharedComponents/CustomHeaderLeft";
import { RootStack } from "../AppStack";

export type OnboardingStackList = {
  JoinProjectQrScreen: { isAdmin: boolean };
  CreateOrJoinScreen: undefined;
  SendJoinRequestScreen: undefined;
  SyncOnboardingScreen: { keepExistingObservations: boolean };
  ProjectInviteModal: { inviteKey: string };
  JoinRequestModal: { deviceName?: string; key?: string } | undefined;
};

// **NOTE**: No hooks allowed here (this is not a component, it is a function
// that returns a react element)
export const createOnboardingScreenGroup = (
  intl: (title: MessageDescriptor) => string
) => (
  <RootStack.Group key="onboarding">
    <RootStack.Screen
      name="CreateOrJoinScreen"
      component={CreateOrJoinScreen}
    />
    <RootStack.Screen
      name="SendJoinRequestScreen"
      component={SendJoinRequestScreen}
      options={{
        headerTitle: intl(SendJoinRequestScreen.navTitle),
        headerStyle: { backgroundColor: MEDIUM_BLUE },
        headerTintColor: WHITE,
        headerLeft: props => (
          <CustomHeaderLeft headerBackButtonProps={props} tintColor={WHITE} />
        ),
      }}
    />
    <RootStack.Screen
      name="SyncOnboardingScreen"
      component={SyncOnboardingScreen}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="JoinProjectQrScreen"
      component={JoinProjectQrScreen}
      options={{
        headerTitle: intl(JoinProjectQrScreen.navTitle),
        headerStyle: { backgroundColor: MEDIUM_BLUE },
        headerTintColor: WHITE,
        headerLeft: props => (
          <CustomHeaderLeft headerBackButtonProps={props} tintColor={WHITE} />
        ),
      }}
    />
    {/* Modal Screen */}
    <RootStack.Screen
      name="ProjectInviteModal"
      component={ProjectInviteModal}
      options={MODAL_NAVIGATION_OPTIONS}
    />
    {/* Modal Screen */}
    <RootStack.Screen
      name="JoinRequestModal"
      component={JoinRequestModal}
      options={MODAL_NAVIGATION_OPTIONS}
    />
  </RootStack.Group>
);
