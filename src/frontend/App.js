// @flow
import "react-native-gesture-handler";

import * as React from "react";
import { LogBox } from "react-native";
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ErrorScreen from "./screens/UncaughtError";
import { AppLoading } from "./AppLoading";
import AppContainerWrapper from "./AppContainerWrapper";
import { PermissionsProvider } from "./context/PermissionsContext";
import { IntlProvider } from "./context/IntlContext";
import AppProvider from "./context/AppProvider";
import bugsnag from "./lib/logger";
import useUpdateNotifierEffect from "./hooks/useUpdateNotifierEffect";
import { ERROR_STORE_KEY, PASSWORD_KEY } from "./constants";
import { SecurityProvider } from "./context/SecurityContext";
import { AuthWrapper } from "./screens/AuthWrapper";
import { AuthContainer } from "./Navigation/AuthContainers";

/**
 * Turn off warnings about:
 * - require cycles
 * - react-native-screens warning that suggests upgrading react-navigation to 5
 */
LogBox.ignoreLogs([
  "Require cycle:",
  "new functionality added to react-native-screens",
]);

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
const App = () => {
  return (
    <IntlProvider>
      <ErrorBoundary>
        {/* Permissions provider must be before AppLoading because it waits for
          permissions before showing main app screen */}
        <PermissionsProvider>
          <SecurityProvider>
            <AppLoading>
              <AppProvider>
                <AuthContainer />
                <UpdateNotifier />
              </AppProvider>
            </AppLoading>
          </SecurityProvider>
        </PermissionsProvider>
      </ErrorBoundary>
    </IntlProvider>
  );
};

export default App;

const formatComponentStack = str => {
  const lines = str.split(/\s*\n\s*/g);
  let ret = "";
  for (let line = 0, len = lines.length; line < len; line++) {
    if (lines[line].length) ret += `${ret.length ? "\n" : ""}${lines[line]}`;
  }
  return ret;
};
