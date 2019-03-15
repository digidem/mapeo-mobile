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
import LocationContext from "../context/LocationContext";
import PermissionsContext from "../context/PermissionsContext";
import ObservationsContext from "../context/ObservationsContext";

// Turn on logging if in debug mode
if (__DEV__) debug.enable("*");

// Use native navigation screens, see: https://github.com/kmagiera/react-native-screens
useScreens();

const App = () => (
  <ErrorBoundary>
    <PermissionsContext.Provider>
      <LocationContext.Provider>
        <ObservationsContext.Provider>
          <AppLoading>
            <AppContainer />
          </AppLoading>
        </ObservationsContext.Provider>
      </LocationContext.Provider>
    </PermissionsContext.Provider>
  </ErrorBoundary>
);

export default App;
