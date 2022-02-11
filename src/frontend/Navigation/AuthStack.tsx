import * as React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { AuthScreen } from "../screens/AuthScreen";
import { AppStack } from "./AppStack";

export const AuthStack = createStackNavigator({ EnterPassword: AuthScreen });
