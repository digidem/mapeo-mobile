import * as React from "react";
import { NavigatorScreenOptions, RootStack, ScreensWithAuth } from "./AppStack";
import { useIntl } from "react-intl";

// React Navigation expects children of the Navigator to be a `Screen`, `Group`
// or `React.Fragment` element type. We want to keep this logic in a separate
// file (so that we can alter included screens at built-time for the ICCA
// variant). If we defined a screen group as a component in a separate file,
// then it would not be of any of these types. Therefore we export screen groups
// as functions that create React Elements (_not_ components), and pass them as
// children of the Navigator component. Because of this we cannot use any
// runtime props or hooks inside the screen groups definitions.
//
// Note that this does the same things as the strange syntax found in
// https://github.com/react-navigation/react-navigation/issues/9578#issuecomment-1022991270
// `{createScreens()}` is equivalent to `{(() => createScreens())()}`
//
// Note that screen groups should have a `key` prop, so that React knows how to
// update them efficiently.

export const AppNavigator = () => {
  const { formatMessage } = useIntl();

  return (
    <RootStack.Navigator
      initialRouteName="Home"
      screenOptions={NavigatorScreenOptions}
    >
      {ScreensWithAuth(formatMessage)}
    </RootStack.Navigator>
  );
};
