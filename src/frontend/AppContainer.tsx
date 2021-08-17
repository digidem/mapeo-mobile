import * as React from "react";
import debug from "debug";
import {
  createAppContainer,
  NavigationActions,
  NavigationContainerComponent,
  NavigationState,
} from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";

import { URI_PREFIX, ERROR_STORE_KEY } from "./constants";
import SettingsContext from "./context/SettingsContext";
// import useProjectInviteListener from "./hooks/useProjectInviteListener";
import IS_E2E from "./lib/is-e2e";
import bugsnag from "./lib/logger";
import { AppStack } from "./NavigationStacks/AppStack";
import { WithModalsStack } from "./NavigationStacks/WithModalsStack";

// Turn on logging if in debug mode
if (__DEV__) debug.enable("*");
const log = debug("mapeo:App");

// WARNING: This needs to change if we change the navigation structure
const getNavStoreKey = (includeOnboarding: boolean) =>
  `@MapeoNavigation@${includeOnboarding ? 9 : 8}`;

const EDITING_SCREEN_NAMES = [
  "AddPhoto",
  "Camera",
  "CategoryChooser",
  "ManualGpsScreen",
  "ObservationDetails",
  "ObservationEdit",
];

const createNavigationStatePersister = (includeOnboarding: boolean) => async (
  navState: NavigationState
) => {
  try {
    await AsyncStorage.setItem(
      getNavStoreKey(includeOnboarding),
      JSON.stringify(navState)
    );
  } catch (err) {
    log("Error saving navigation state", err);
  }
};

const createNavigationStateLoader = (
  includeOnboarding: boolean
) => async () => {
  try {
    const navState = JSON.parse(
      (await AsyncStorage.getItem(getNavStoreKey(includeOnboarding))) as string
    );
    const didCrashLastOpen = JSON.parse(
      (await AsyncStorage.getItem(ERROR_STORE_KEY)) as string
    );
    // Clear error saved state so that navigation persistence happens on next load
    await AsyncStorage.setItem(ERROR_STORE_KEY, JSON.stringify(false));
    // If the app crashed last time, don't restore nav state
    if (didCrashLastOpen) {
      bugsnag.leaveBreadcrumb("Crash on last open");
      log("Crashed on last open, skipping load of navigation state");
      return null;
    } else {
      return navState;
    }
  } catch (error) {
    bugsnag.leaveBreadcrumb("Error loading nav state", { error });
    log("Error reading navigation and error state", error);
  }
};

const getRouteName = (navState?: NavigationState): string | null => {
  if (!navState) {
    return null;
  }

  const route = navState.routes[navState.index];

  if (route?.routes) {
    return getRouteName(route);
  }

  return route.routeName;
};

const inviteModalDisabledOnRoute = (routeName: string) =>
  EDITING_SCREEN_NAMES.includes(routeName);

const AppContainerWrapper = () => {
  const navRef = React.useRef<NavigationContainerComponent>();
  const [inviteModalEnabled, setInviteModalEnabled] = React.useState(true);
  const [queuedInvite, setQueuedInvite] = React.useState<string | null>(null);
  const [{ experiments }] = React.useContext(SettingsContext);

  const onNavStateChange = (
    previousState: NavigationState,
    currentState: NavigationState
  ) => {
    const previousRouteName = getRouteName(previousState);
    const currentRouteName = getRouteName(currentState);

    if (previousRouteName !== currentRouteName && currentRouteName) {
      setInviteModalEnabled(!inviteModalDisabledOnRoute(currentRouteName));
    }
  };

  const openInviteModal = React.useCallback((key: string) => {
    if (navRef.current) {
      navRef.current.dispatch(
        NavigationActions.navigate({
          routeName: "ProjectInviteModal",
          params: { invite: key },
        })
      );
    }
  }, []);

  const { loadNavigationState, persistNavigationState } = React.useMemo(
    () =>
      IS_E2E
        ? {}
        : {
            loadNavigationState: createNavigationStateLoader(
              experiments.onboarding
            ),
            persistNavigationState: createNavigationStatePersister(
              experiments.onboarding
            ),
          },
    [experiments.onboarding]
  );

  const AppContainer = React.useMemo(
    () =>
      createAppContainer(experiments.onboarding ? WithModalsStack : AppStack),
    [experiments.onboarding]
  );

  /**
   * TODO: Uncomment when project invites are supported
   */
  //   useProjectInviteListener(invite => {
  //     if (inviteModalEnabled) {
  //       openInviteModal(invite);
  //     } else {
  //       setQueuedInvite(invite);
  //     }
  //   });

  React.useEffect(() => {
    if (inviteModalEnabled && queuedInvite) {
      setQueuedInvite(null);
      openInviteModal(queuedInvite);
    }
  }, [inviteModalEnabled, queuedInvite, openInviteModal]);

  return (
    <AppContainer
      loadNavigationState={loadNavigationState}
      onNavigationStateChange={onNavStateChange}
      persistNavigationState={persistNavigationState}
      ref={nav => {
        if (nav) {
          navRef.current = nav;
        }
      }}
      uriPrefix={URI_PREFIX}
    />
  );
};

export default AppContainerWrapper;
