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
// import { useScreens } from "react-native-screens";

import ErrorBoundary from "./ErrorBoundary";
import AppLoading from "./AppLoading";
import AppContainer from "../navigation/AppContainer";
import PermissionsContext from "../context/PermissionsContext";
import AppProvider from "../context/AppProvider";

// Turn on logging if in debug mode
if (__DEV__) debug.enable("*");

// Use native navigation screens, see: https://github.com/kmagiera/react-native-screens
// useScreens();

const App = () => (
  <ErrorBoundary>
    {/* Permissions provider must be before AppLoading because it waits for
        permissions before showing main app screen */}
    <PermissionsContext.Provider>
      <AppLoading>
        {/* AppProvider must be after AppLoading because it makes requests to the
            mapeo-core server. AppLoading only renders children once the server
            is ready and listening */}
        <AppProvider>
          <AppContainer />
        </AppProvider>
      </AppLoading>
    </PermissionsContext.Provider>
  </ErrorBoundary>
);

export default App;
