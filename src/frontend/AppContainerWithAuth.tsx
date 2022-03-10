import * as React from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  NavigationState,
} from "react-navigation";

import AppContainerWrapper, { loadSavedNavState } from "./AppContainerWrapper";
import useSettingsValue from "./hooks/useSettingsValue";
import { AuthLoading } from "./screens/AuthLoading";
import { AuthScreen } from "./screens/AuthScreen";

const Container = createAppContainer(
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

export const NavStateContext = React.createContext<{
  navState?: NavigationState;
  fetchSavedNavState: () => Promise<void>;
}>({ navState: undefined, fetchSavedNavState: async () => {} });

export const useNavState = () => {
  const navState = React.useContext(NavStateContext);
  return navState;
};

export const AppContainerWithAuth = () => {
  const [loadedNavState, setLoadedNavState] = React.useState<NavigationState>();

  const { onboarding } = useSettingsValue("experiments");

  const fetchSavedNavState = async () => {
    const navState = await loadSavedNavState(onboarding);
    setLoadedNavState(navState);
  };

  React.useEffect(() => {
    fetchSavedNavState();
  }, [fetchSavedNavState]);

  const value = React.useMemo(
    () => ({
      navState: loadedNavState,
      fetchSavedNavState,
    }),
    [loadedNavState, fetchSavedNavState]
  );

  return (
    <NavStateContext.Provider value={value}>
      <Container />
    </NavStateContext.Provider>
  );
};
