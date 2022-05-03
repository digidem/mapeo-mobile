import * as React from "react";
import debug from "debug";
import {
  NavigationActions,
  NavigationContainerComponent,
  NavigationState,
} from "react-navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  EDITING_SCREEN_NAMES,
  ERROR_STORE_KEY,
  IS_E2E,
  NAV_STORE_KEY,
  NO_PRACTICE_BAR,
  TEMP_HIDE_PRACTICE_MODE_UI,
  URI_PREFIX,
} from "./constants";
// import useProjectInviteListener from "./hooks/useProjectInviteListener";
import bugsnag from "./lib/logger";
import { PracticeMode } from "./sharedComponents/PracticeMode";
import DefaultContainer from "./Navigation/DefaultContainer";
import OnboardingContainer from "./Navigation/OnboardingContainer";
import { devExperiments, featureFlagOn } from "./lib/DevExperiments";

// Turn on logging if in debug mode
if (__DEV__) debug.enable("*");
const log = debug("mapeo:App");

const createNavigationStatePersister = () => async (
  navState: NavigationState
) => {
  if (featureFlagOn) return;
  try {
    await AsyncStorage.setItem(NAV_STORE_KEY, JSON.stringify(navState));
  } catch (err) {
    log("Error saving navigation state", err);
  }
};

const loadSavedNavState = async () => {
  try {
    if (featureFlagOn) return null;
    const navState = JSON.parse(
      (await AsyncStorage.getItem(NAV_STORE_KEY)) as string
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

const inviteModalDisabledOnRoute = (routeName: string | null) =>
  routeName !== null && EDITING_SCREEN_NAMES.includes(routeName);

function hidePracticeBarForRoute(route: string | null) {
  return route !== null && NO_PRACTICE_BAR.includes(route);
}

function hidePracticeModeTemporarily(route: string | null) {
  return route !== null && TEMP_HIDE_PRACTICE_MODE_UI.includes(route);
}

const AppContainerWrapper = () => {
  const navRef = React.useRef<NavigationContainerComponent>();
  const [inviteModalEnabled, setInviteModalEnabled] = React.useState(true);
  const [queuedInvite, setQueuedInvite] = React.useState<string | null>(null);
  const [hidePracticeBar, setHidePracticeBar] = React.useState(true);
  const [hidePracticeMode, setHidePracticeMode] = React.useState(false);
  const { onboarding } = devExperiments;

  const updateRouteBasedAppState = React.useCallback(
    (routeName: string | null) => {
      setInviteModalEnabled(!inviteModalDisabledOnRoute(routeName));
      setHidePracticeBar(hidePracticeBarForRoute(routeName));
      setHidePracticeMode(hidePracticeModeTemporarily(routeName));
    },
    []
  );

  const onNavStateChange = React.useCallback(
    (previousState: NavigationState, currentState: NavigationState) => {
      const previousRouteName = getRouteName(previousState);
      const currentRouteName = getRouteName(currentState);

      if (previousRouteName !== currentRouteName) {
        updateRouteBasedAppState(currentRouteName);
      }
    },
    [updateRouteBasedAppState]
  );

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
            loadNavigationState: async () => {
              const loadedNavState = await loadSavedNavState();

              const loadedRouteName = getRouteName(loadedNavState);

              updateRouteBasedAppState(loadedRouteName);

              return loadedNavState;
            },
            persistNavigationState: createNavigationStatePersister(),
          },
    [updateRouteBasedAppState]
  );

  const AppContainer = devExperiments.onboarding
    ? OnboardingContainer
    : DefaultContainer;

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
    <PracticeMode
      enabled={devExperiments.onboarding && !hidePracticeMode}
      hideBar={hidePracticeBar}
    >
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
    </PracticeMode>
  );
};

export default AppContainerWrapper;
