import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { KILL_KEY, PASSWORD_KEY } from "../constants";

type AppModeTypes = "normal" | "kill";
type AuthStatusTypes = "pending" | "authenticated" | "notRequired";

export type AuthState = {
  passcode: string | null;
  appMode: AppModeTypes;
  killModeEnabled: boolean;
  authStatus: AuthStatusTypes;
};

type AuthActions =
  | { type: "setPasscode"; newPasscode: string | null }
  | { type: "appMode:set"; newAppMode: AppModeTypes }
  | { type: "killModeEnabled:set"; newKillModeValue: boolean }
  | { type: "setAuthStatus"; newAuthStatus: AuthStatusTypes };

function securityReducer(state: AuthState, action: AuthActions): AuthState {
  switch (action.type) {
    /***
     * if passcode is set to null we need to set the auth status to 'notRequired'
     *
     * If a passcode is set, we want to set the authStatus to 'authenticated'
     * If the auth status is set to 'pending' they will be navigated to the auth screen, to type in their password.
     */
    case "setPasscode":
      const passcode = action.newPasscode;
      if (!validPasscode(passcode)) throw new Error("Invalid New Password");

      AsyncStorage.setItem(PASSWORD_KEY, passcode || "");
      if (!passcode) {
        AsyncStorage.setItem(KILL_KEY, JSON.stringify(false));
        return {
          ...state,
          passcode,
          authStatus: "notRequired",
          appMode: "normal",
          killModeEnabled: false,
        };
      }

      return { ...state, passcode, authStatus: "authenticated" };
    /***
     * sets new app mode
     */
    case "appMode:set":
      return { ...state, appMode: action.newAppMode };

    case "killModeEnabled:set":
      if (!state.passcode && action.newKillModeValue) {
        throw new Error('Cannot enable "killMode" until password has been set');
      }

      AsyncStorage.setItem(KILL_KEY, JSON.stringify(action.newKillModeValue));

      return { ...state, killModeEnabled: action.newKillModeValue };
    /**
     * If auth status is pending, the user will only see the auth screen and will be prompted to type in their password
     *
     */
    case "setAuthStatus":
      if (
        (action.newAuthStatus === "authenticated" ||
          action.newAuthStatus === "pending") &&
        state.passcode === null
      ) {
        throw new Error(
          "Cannot require authentication unless a password is set"
        );
      }
      return { ...state, authStatus: action.newAuthStatus };
  }
}

const DefaultState: AuthState = {
  appMode: "normal",
  authStatus: "notRequired",
  killModeEnabled: false,
  passcode: null,
};

type SecurityContextType = readonly [AuthState, React.Dispatch<AuthActions>];

export const SecurityContext = React.createContext<SecurityContextType>([
  DefaultState,
  () => {},
]);

export const SecurityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = React.useReducer(securityReducer, DefaultState);

  const contextValue: SecurityContextType = React.useMemo(() => {
    return [state, dispatch];
  }, [state, dispatch]);

  React.useEffect(() => {
    async function initialize() {
      const [[, password], [, killModeEnabled]] = await AsyncStorage.multiGet([
        PASSWORD_KEY,
        KILL_KEY,
      ]);

      if (!!password) {
        dispatch({ type: "setPasscode", newPasscode: password });
        dispatch({ type: "setAuthStatus", newAuthStatus: "pending" });
      }

      if (killModeEnabled === "true" && !!password) {
        dispatch({ type: "killModeEnabled:set", newKillModeValue: true });
      } else {
        dispatch({ type: "killModeEnabled:set", newKillModeValue: false });
      }
    }

    initialize();
  }, []);

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

function validPasscode(passcode: string | null): boolean {
  if (passcode === null) return true;
  else return passcode.length === 5 && !isNaN(parseInt(passcode!, 10));
}
