/* global __DEV__ */
// @flow
import * as React from "react";
import { YellowBox } from "react-native";
import debug from "debug";
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from "@react-native-community/async-storage";

import ErrorScreen from "./screens/UncaughtError";
import AppLoading from "./AppLoading";
import AppContainer from "./AppContainer";
import { PermissionsProvider } from "./context/PermissionsContext";
import { IntlProvider } from "./context/IntlContext";
import AppProvider from "./context/AppProvider";
import bugsnag from "./lib/logger";
import IS_E2E from "./lib/is-e2e";
import useUpdateNotifierEffect from "./hooks/useUpdateNotifierEffect";
import { JoinProjectScreen } from "./screens/JoinProjectSplash";

// Turn off warnings about require cycles
YellowBox.ignoreWarnings(["Require cycle:"]);

// Turn on logging if in debug mode
if (__DEV__) debug.enable("*");
const log = debug("mapeo:App");
// WARNING: This needs to change if we change the navigation structure
const NAV_STORE_KEY = "@MapeoNavigation@8";
const ERROR_STORE_KEY = "@MapeoError";

const persistNavigationState = IS_E2E
  ? undefined
  : async navState => {
      try {
        await AsyncStorage.setItem(NAV_STORE_KEY, JSON.stringify(navState));
      } catch (err) {
        log("Error saving navigation state", err);
      }
    };
const loadNavigationState = IS_E2E
  ? undefined
  : async () => {
      try {
        const navState = JSON.parse(await AsyncStorage.getItem(NAV_STORE_KEY));
        const didCrashLastOpen = JSON.parse(
          await AsyncStorage.getItem(ERROR_STORE_KEY)
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

/**
 * Catches Javascript errors anywhere in the child component tree, logs the
 * errors and displays a fallback UI.
 */
class ErrorBoundary extends React.Component<
  {
    children: React.Node,
  },
  {
    hasError: boolean,
  }
> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // This is rendered outside AppLoading, so SpashScreen could still be
    // showing if error occurs in AppLoading before it's hidden
    SplashScreen.hide();
    bugsnag.notify(error, function (report) {
      report.severity = "error";
      report.metadata = {
        react: {
          componentStack: formatComponentStack(info.componentStack),
        },
      };
    });
    // Record that we have an error so that when the app restarts we can
    // react to the previous uncaught error
    AsyncStorage.setItem(ERROR_STORE_KEY, JSON.stringify(true));
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return <ErrorScreen />;
  }
}

const UpdateNotifier = () => {
  useUpdateNotifierEffect();
  return null;
};

/* IntlProvider needs to be first so that error messages are translated */
const App = () => (
  <IntlProvider>
    <ErrorBoundary>
      {/* Permissions provider must be before AppLoading because it waits for
        permissions before showing main app screen */}
      <PermissionsProvider>
        <AppLoading>
          <AppProvider>
            <AppContainer
              persistNavigationState={persistNavigationState}
              loadNavigationState={loadNavigationState}
            />

            <UpdateNotifier />
          </AppProvider>
        </AppLoading>
      </PermissionsProvider>
    </ErrorBoundary>
  </IntlProvider>
);

export default App;

const formatComponentStack = str => {
  const lines = str.split(/\s*\n\s*/g);
  let ret = "";
  for (let line = 0, len = lines.length; line < len; line++) {
    if (lines[line].length) ret += `${ret.length ? "\n" : ""}${lines[line]}`;
  }
  return ret;
};
