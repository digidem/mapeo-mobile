import React from "react";
import CustomHeaderLeft from "../sharedComponents/CustomHeaderLeft";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  HeaderButtonProps,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack/lib/typescript/src/types";
import { IccaStackList } from "../screens/Intro";
import {
  createOnboardingScreenGroup,
  OnboardingStackList,
} from "./ScreenGroups/Onboarding";
import { AppList, createDefaultScreenGroup } from "./ScreenGroups/AppScreens";
import {
  AppPasscodeStackList,
  createAppPasscodeScreenGroup,
} from "./ScreenGroups/AppPasscode";
import { MessageDescriptor } from "react-intl";
import { devExperiments } from "../lib/DevExperiments";
import { AuthStackList, createAuthScreenGroup } from "./ScreenGroups/Auth";
import { useAuthState } from "../hooks/useAuthState";

export type AppStackList = AppList &
  OnboardingStackList &
  IccaStackList &
  AppPasscodeStackList &
  AuthStackList;

export const RootStack = createNativeStackNavigator<AppStackList>();

export const NavigatorScreenOptions: NativeStackNavigationOptions = {
  presentation: "card",
  headerStyle: { backgroundColor: "#ffffff" },
  headerLeft: (props: HeaderButtonProps) => (
    <CustomHeaderLeft headerBackButtonProps={props} />
  ),
  // This only hides the DEFAULT back button. We render a custom one in headerLeft, so the default one should always be hidden.
  // This **might** cause a problem for IOS
  headerBackVisible: false,
};

export const ScreensWithAuth = (intl: (title: MessageDescriptor) => string) => {
  const authState = useAuthState();
  return (
    <React.Fragment>
      {authState === "unauthenticated" ? (
        createAuthScreenGroup()
      ) : (
        <React.Fragment>
          {createDefaultScreenGroup(intl)}
          {devExperiments.onboarding && createOnboardingScreenGroup(intl)}
          {createAppPasscodeScreenGroup(intl)}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
