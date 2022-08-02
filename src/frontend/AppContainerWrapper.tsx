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
import { AppStackList } from "./Navigation/AppStack";
// import { Linking } from "react-native";
import Loading from "./sharedComponents/Loading";
import {
  hidePracticeBarForRoute,
  hidePracticeModeTemporarily,
  inviteModalDisabledOnRoute,
  loadSavedNavState,
  persistNavigationState,
} from "./Navigation/navigationStateHelperFunctions";
import { AppNavigator } from "./Navigation/AppNavigator";
import ConfigContext from "./context/ConfigContext";

// Turn on logging if in debug mode
if (__DEV__) debug.enable("*");
const log = debug("mapeo:App");

const AppContainerWrapper = () => {
  const [queuedInvite, setQueuedInvite] = React.useState<string | null>(null);

  const [initialNavState, setInitialNavState] = React.useState<
    InitialState | "loading" | undefined
  >("loading");

  const [config] = React.useContext(ConfigContext);

  const navRef = useNavigationContainerRef<AppStackList>();

  const currentRoute = navRef.isReady()
    ? navRef.getCurrentRoute()?.name
    : undefined;

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
        const initialUrl = undefined; //await Linking.getInitialURL();

        // if deeplinking, dont set initial state
        if (initialUrl) {
          setInitialNavState(undefined);
          return;
        }

        setInitialNavState(await loadSavedNavState(log));
      } catch {
        // handle error here
      }
    }
  }, []);

  const handleNavStateChange = React.useCallback(
    (navState?: NavigationState) => {
      if (!navState || IS_E2E) return;
      persistNavigationState(log, navState);
    },
    []
  );

  const inviteModalEnabled = inviteModalDisabledOnRoute(currentRoute);
  const hidePracticeBar = hidePracticeBarForRoute(currentRoute);
  const hidePracticeMode = hidePracticeModeTemporarily(currentRoute);

  React.useEffect(() => {
    if (inviteModalEnabled && queuedInvite && navRef.isReady()) {
      setQueuedInvite(null);
      navRef.navigate("ProjectInviteModal", { inviteKey: queuedInvite });
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
        initialState={initialNavState}
        onStateChange={handleNavStateChange}
        linking={{ prefixes: [URI_PREFIX] }}
        ref={navRef}
      >
        <AppNavigator />
      </NavigationContainer>
    </PracticeMode>
  );
};

export default AppContainerWrapper;
