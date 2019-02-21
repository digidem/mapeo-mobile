// @flow
import * as React from "react";
import debug from "debug";
import SplashScreen from "react-native-splash-screen";

import ErrorScreen from "./ErrorScreen";

const log = debug("mapeo:ErrorBoundary");

type Props = {
  children: React.Node
};

type State = {
  hasError: boolean
};

/**
 * Catches Javascript errors anywhere in the child component tree, logs the
 * errors and displays a fallback UI.
 */
class ErrorBoundary extends React.Component<Props, State> {
  state = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // This is rendered outside AppLoading, so SpashScreen could still be
    // showing if error occurs in AppLoading before it's hidden
    SplashScreen.hide();
    log("Uncaught error in component tree:", error);
    log(info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return <ErrorScreen />;
  }
}

export default ErrorBoundary;
