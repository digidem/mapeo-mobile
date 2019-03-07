/* global __DEV__ */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React from "react";
import debug from "debug";
import { useScreens } from "react-native-screens";

import ErrorBoundary from "./ErrorBoundary";
import AppLoading from "./AppLoading";
import AppContainer from "./AppContainer";
import { LocationProvider } from "../context/Location";

// Turn on logging if in debug mode
if (__DEV__) debug.enable("*");

// Use native navigation screens, see: https://github.com/kmagiera/react-native-screens
useScreens();

const App = () => (
  <ErrorBoundary>
    <AppLoading>
      <LocationProvider>
        <AppContainer />
      </LocationProvider>
    </AppLoading>
  </ErrorBoundary>
);

export default App;
