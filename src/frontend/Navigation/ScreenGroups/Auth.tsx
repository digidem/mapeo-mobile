import * as React from "react";
import { AuthScreen } from "../../screens/AuthScreen";
import { RootStack } from "../AppStack";

export type AuthStackList = {
  AuthScreen: undefined;
};

export const createAuthScreenGroup = () => {
  return (
    <RootStack.Group>
      <RootStack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
    </RootStack.Group>
  );
};
