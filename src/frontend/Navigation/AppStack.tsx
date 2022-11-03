import React from "react";
import CustomHeaderLeft from "../sharedComponents/CustomHeaderLeft";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  HeaderButtonProps,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack/lib/typescript/src/types";
import { WHITE } from "../lib/styles";
import { IccaStackList } from "../screens/Intro";
import { OnboardingStackList } from "./ScreenGroups/Onboarding";
import { AppList } from "./ScreenGroups/AppScreens";
import { AppPasscodeStackList } from "./ScreenGroups/AppPasscode";

export { createOnboardingScreenGroup } from "./ScreenGroups/Onboarding";
export { createDefaultScreenGroup } from "./ScreenGroups/AppScreens";
export { createAppPasscodeScreenGroup } from "./ScreenGroups/AppPasscode";

export type AppStackList = AppList &
  OnboardingStackList &
  IccaStackList &
  AppPasscodeStackList;

export const RootStack = createNativeStackNavigator<AppStackList>();

export const NavigatorScreenOptions: NativeStackNavigationOptions = {
  presentation: "card",
  contentStyle: { backgroundColor: WHITE },
  headerStyle: { backgroundColor: WHITE },
  headerLeft: (props: HeaderButtonProps) => (
    <CustomHeaderLeft headerBackButtonProps={props} />
  ),
  // This only hides the DEFAULT back button. We render a custom one in headerLeft, so the default one should always be hidden.
  // This **might** cause a problem for IOS
  headerBackVisible: false,
};
