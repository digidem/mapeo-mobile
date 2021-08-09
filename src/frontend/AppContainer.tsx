import * as React from "react";
import debug from "debug";
// import {
//   createAppContainer,
//   NavigationActions,
//   NavigationContainerComponent,
//   NavigationState,
// } from "react-navigation";
import AsyncStorage from "@react-native-community/async-storage";

import { URI_PREFIX } from "./constants";
// import useProjectInviteListener from "./hooks/useProjectInviteListener";
import IS_E2E from "./lib/is-e2e";
import bugsnag from "./lib/logger";
import { AppStack, AppStackNavTypes } from "./NavigationStacks/AppStack";
import { WithModalsStack } from "./NavigationStacks/WithModalsStack";
import {
  NavigationContainer,
  NavigationContainerRef,
  NavigationState,
} from "@react-navigation/native";
import { Linking } from "react-native";
import { useEffect } from "react";

// Turn on logging if in debug mode
if (__DEV__) debug.enable("*");
const log = debug("mapeo:App");
// WARNING: This needs to change if we change the navigation structure
const NAV_STORE_KEY = `@MapeoNavigation@${
  process.env.FEATURE_ONBOARDING === "true" ? 9 : 8
}`;
const ERROR_STORE_KEY = "@MapeoError";

const EDITING_SCREEN_NAMES = [
  "AddPhoto",
  "Camera",
  "CategoryChooser",
  "ManualGpsScreen",
  "ObservationDetails",
  "ObservationEdit",
];

const persistNavigationState = IS_E2E
  ? undefined
  : async (navState: NavigationState | undefined) => {
      try {
        await AsyncStorage.setItem(NAV_STORE_KEY, JSON.stringify(navState));
      } catch (err) {
        log("Error saving navigation state", err);
      }
    };

async function checkForPreviousCrash(): Promise<boolean> {
  const didCrashLastOpen = JSON.parse(
    (await AsyncStorage.getItem(ERROR_STORE_KEY)) as string
  );
  // Clear error saved state so that navigation persistence happens on next load
  await AsyncStorage.setItem(ERROR_STORE_KEY, JSON.stringify(false));

  if (didCrashLastOpen) {
    bugsnag.leaveBreadcrumb("Crash on last open");
    log("Crashed on last open, skipping load of navigation state");
    return true;
  } else return false;
}

const getRouteName = (navState?: NavigationState): string | null => {
  if (!navState) {
    return null;
  }

  const route = navState.routes[navState.index];

  return route.name;
};

const inviteModalDisabledOnRoute = (routeName: string) =>
  EDITING_SCREEN_NAMES.includes(routeName);

const AppContainerWrapper = () => {
  const navRef = React.useRef<NavigationContainerRef<AppStackNavTypes>>();
  const [inviteModalEnabled, setInviteModalEnabled] = React.useState(true);
  const [queuedInvite, setQueuedInvite] = React.useState<string | null>(null);
  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    NavigationState | undefined
  >(undefined);

  async function restoreState() {
    //Will not restore state in e2e testing
    if (IS_E2E) return;

    const initialUrl = await Linking.getInitialURL();

    //Will not restore state if deeplinking
    if (!!initialUrl) return;

    if (await checkForPreviousCrash()) return;

    const savedStateString = (await AsyncStorage.getItem(
      NAV_STORE_KEY
    )) as string;
    const state = JSON.parse(savedStateString) || undefined;

    if (!!state) {
      setInitialState(state);
    }
  }

  useEffect(() => {
    restoreState();
  }, []);
  // const onNavStateChange = (
  //   state: NavigationState|undefined) => {
  //   const previousRouteName = getRouteName(previousState);
  //   const currentRouteName = getRouteName(currentState);

  //   if (previousRouteName !== currentRouteName && currentRouteName) {
  //     setInviteModalEnabled(!inviteModalDisabledOnRoute(currentRouteName));
  //   }
  // };

  const openInviteModal = React.useCallback((key: string) => {
    if (!navRef) {
      // navRef.navigate({
      //     routeName: "ProjectInviteModal",
      //     params: { invite: key },
      //   })
      // );
    }
  }, []);

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
    <NavigationContainer
      initialState={initialState}
      onStateChange={persistNavigationState}
    >
      {process.env.FEATURE_ONBOARDING === "true" ? (
        //TO DO, replace first one
        <AppStack />
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
};

export default AppContainerWrapper;
