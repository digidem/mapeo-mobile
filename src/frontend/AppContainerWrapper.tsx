import * as React from "react";
import debug from "debug";

import { IS_E2E, URI_PREFIX } from "./constants";
// import useProjectInviteListener from "./hooks/useProjectInviteListener";
import { PracticeMode } from "./sharedComponents/PracticeMode";
import { devExperiments, featureFlagOn } from "./lib/DevExperiments";
import {
  NavigationContainer,
  InitialState,
  NavigationState,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { AppStack, AppStackList } from "./Navigation/AppStack";
import { Linking } from "react-native";
import Loading from "./sharedComponents/Loading";
import {
  getRouteName,
  hidePracticeBarForRoute,
  hidePracticeModeTemporarily,
  inviteModalDisabledOnRoute,
  loadSavedNavState,
  persistNavigationState,
} from "./Navigation/NavigationStateHelperFunctions";

const AppContainer = AppStack;

// Turn on logging if in debug mode
if (__DEV__) debug.enable("*");
const log = debug("mapeo:App");

const AppContainerWrapper = () => {
  const [currentRoute, setCurrentRoute] = React.useState<string | null>(null);
  const [queuedInvite, setQueuedInvite] = React.useState<string | null>(null);

  const navRef = useNavigationContainerRef<AppStackList>();

  const [initialNavState, setInitialNavState] = React.useState<
    InitialState | "loading" | undefined
  >("loading");

  React.useEffect(() => {
    if (featureFlagOn) {
      setInitialNavState(undefined);
      return;
    }

    restoreNavState();

    async function restoreNavState() {
      try {
        // When we support deeplinking we need to fix this. Currently it is never resolving
        // You can find issue here: https://github.com/facebook/react-native/issues/25675
        // const initialUrl = await Linking.getInitialURL();

        const initialUrl = undefined;
        // if deeplinking, dont set initial state
        if (!!initialUrl) {
          setInitialNavState(undefined);
          return;
        }
      } finally {
        setInitialNavState(await loadSavedNavState(log));
      }
    }
  }, []);

  const handleNavStateChange = React.useCallback(
    (navState?: NavigationState) => {
      if (!navState || IS_E2E) return;
      setCurrentRoute(getRouteName(navState));
      persistNavigationState(log, navState);
    },
    [IS_E2E]
  );

  const inviteModalEnabled = inviteModalDisabledOnRoute(currentRoute);
  const hidePracticeBar = hidePracticeBarForRoute(currentRoute);
  const hidePracticeMode = hidePracticeModeTemporarily(currentRoute);

  /**
   * TODO: Uncomment when project invites are supported
   */
  //   useProjectInviteListener(invite => {
  //     if () {
  //       openInviteModal(invite);
  //     } else {
  //       setQueuedInvite(invite);
  //     }
  //   });

  React.useEffect(() => {
    if (inviteModalEnabled && queuedInvite) {
      setQueuedInvite(null);

      if (!!navRef) {
        navRef.navigate("ProjectInviteModal", { inviteKey: queuedInvite });
      }
    }
  }, [navRef, inviteModalEnabled, queuedInvite]);

  if (initialNavState === "loading") {
    return <Loading />;
  }

  return (
    <PracticeMode
      enabled={devExperiments.onboarding && !hidePracticeMode}
      hideBar={hidePracticeBar}
    >
      <NavigationContainer
        initialState={initialNavState} // === 'loading' ? undefined : initialNavState}
        onStateChange={handleNavStateChange}
      >
        <AppContainer />
      </NavigationContainer>
    </PracticeMode>
  );
};

export default AppContainerWrapper;
