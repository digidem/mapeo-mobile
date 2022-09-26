import * as React from "react";
import { MessageDescriptor } from "react-intl";
import { AppPasscode } from "../../screens/AppPasscode";
import { ObscurePasscode } from "../../screens/ObscurePasscode";
import { RootStack } from "../AppStack";

export type AppPasscodeStackList = {
  AppPasscode: undefined;
  ObscurePasscode: undefined;
};

// **NOTE**: No hooks allowed here (this is not a component, it is a function
// that returns a react element)
export const createAppPasscodeScreenGroup = (
  intl: (title: MessageDescriptor) => string
) => (
  <RootStack.Group key="appPasscode">
    <RootStack.Screen
      name="AppPasscode"
      component={AppPasscode}
      options={{ headerTitle: intl(AppPasscode.navTitle) }}
    />
    <RootStack.Screen
      name="ObscurePasscode"
      component={ObscurePasscode}
      options={{ headerTitle: intl(ObscurePasscode.navTitle) }}
    />
  </RootStack.Group>
);
