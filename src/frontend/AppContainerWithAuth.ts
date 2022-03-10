import { createAppContainer, createSwitchNavigator } from "react-navigation";

import AppContainerWrapper from "./AppContainerWrapper";
import { AuthLoading } from "./screens/AuthLoading";
import { AuthScreen } from "./screens/AuthScreen";

export const AppContainerWithAuth = createAppContainer(
  createSwitchNavigator(
    {
      App: AppContainerWrapper,
      AuthLoading: AuthLoading,
      Auth: AuthScreen,
    },
    {
      initialRouteName: "AuthLoading",
      resetOnBlur: false,
    }
  )
);
