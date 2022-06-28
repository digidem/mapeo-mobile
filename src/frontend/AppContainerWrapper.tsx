import * as React from "react";
import debug from "debug";
// import {
//   NavigationActions,
//   NavigationContainerComponent,
//   NavigationState,
// } from "react-navigation";
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
import OnboardingContainer from "./Navigation/OnboardingContainer";
import { devExperiments, featureFlagOn } from "./lib/DevExperiments";
import {
  NavigationContainer,
  createNavigationContainerRef,
  InitialState,
  NavigationState,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { AppStack, AppStackList } from "./Navigation/AppStack";
import { Linking } from "react-native";

const AppContainer = AppStack;
//  devExperiments.onboarding
//   ? OnboardingContainer
//   : DefaultContainer;

// Turn on logging if in debug mode
if (__DEV__) debug.enable("*");
const log = debug("mapeo:App");

const createNavigationStatePersister = (navState?: NavigationState) => {
  if (featureFlagOn) return;
  try {
    if (!navState)
      throw new Error("Navigation state is undefined while trying to save it");
    AsyncStorage.setItem(NAV_STORE_KEY, JSON.stringify(navState));
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
  return !!navState ? navState.routes[navState.index].name : null;
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
  const [inviteModalEnabled, setInviteModalEnabled] = React.useState(true);
  const [queuedInvite, setQueuedInvite] = React.useState<string | null>(null);
  const [hidePracticeBar, setHidePracticeBar] = React.useState(true);
  const [hidePracticeMode, setHidePracticeMode] = React.useState(false);

  const navRef = useNavigationContainerRef<AppStackList>();

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<InitialState>();
  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (initialUrl == null) {
          // Only restore state if there's no deep link
          const savedStateString = await AsyncStorage.getItem(NAV_STORE_KEY);
          const state: InitialState = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  const updateRouteBasedAppState = React.useCallback(
    (routeName: string | null) => {
      setInviteModalEnabled(!inviteModalDisabledOnRoute(routeName));
      setHidePracticeBar(hidePracticeBarForRoute(routeName));
      setHidePracticeMode(hidePracticeModeTemporarily(routeName));
    },
    []
  );

  const openInviteModal = React.useCallback((key: string) => {
    if (!!navRef) {
      navRef.navigate("ProjectInviteModal", { inviteKey: key });
    }
  }, []);

  const handleNavStateChange = React.useCallback(
    (navState?: NavigationState) => {
      if (!navState) return;
      //TO DO: Check if prev route !== current route
      updateRouteBasedAppState(getRouteName(navState));
      createNavigationStatePersister(navState);
    },
    [updateRouteBasedAppState]
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
    <PracticeMode
      enabled={devExperiments.onboarding && !hidePracticeMode}
      hideBar={hidePracticeBar}
    >
      <NavigationContainer
        initialState={initialState}
        onStateChange={handleNavStateChange}
      >
        <AppContainer />
      </NavigationContainer>
    </PracticeMode>
  );
};

export default AppContainerWrapper;
