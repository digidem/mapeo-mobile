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
  | { type: "toggleAppMode"; newAppMode?: AppModeTypes }
  | { type: "toggleKillModeEnabled"; newKillModeValue?: boolean }
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
        return {
          ...state,
          passcode,
          authStatus: "notRequired",
          appMode: "normal",
        };
      }

      return { ...state, passcode, authStatus: "authenticated" };
    /***
     * Does not require a new value in the dispatcher payload, but a new value is optional in the payload
     * If there is no new value, the value is toggled (as there are only 2 values)
     */
    case "toggleAppMode":
      if (!action.newAppMode) {
        return {
          ...state,
          appMode: state.appMode === "kill" ? "normal" : "kill",
        };
      }

      return { ...state, appMode: action.newAppMode };

    //will throw an error if the user does NOT have a password AND if the user is trying to set killMode to true
    //With the killMode dispatch code, the user does not have to explicity set a value for kill mode
    //If there is no value set, the kill mode just toggles, hence why I am checking if the value is
    //explicitly being set to true, OR if it is not being set and kill mode is CURRENTLY false (and therfore will be set to true)
    case "toggleKillModeEnabled":
      if (
        !state.passcode &&
        (action.newKillModeValue ||
          (action.newKillModeValue === undefined && !state.killModeEnabled))
      ) {
        throw new Error('Cannot enable "killMode" until password has been set');
      }

      if (action.newKillModeValue === undefined) {
        return { ...state, killModeEnabled: !state.killModeEnabled };
      }

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

type SecurityContextType = readonly [
  AuthState,
  React.Dispatch<AuthActions>,
  () => void
];

export const SecurityContext = React.createContext<SecurityContextType>([
  DefaultState,
  () => {},
  () => {},
]);

export const SecurityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = React.useReducer(securityReducer, DefaultState);

  const contextValue: SecurityContextType = React.useMemo(() => {
    return [state, dispatch, loadInitialState];
  }, [state, dispatch]);

  React.useEffect(() => {
    async function initialize() {
      const [[, password], [, appMode]] = await AsyncStorage.multiGet([
        PASSWORD_KEY,
        KILL_KEY,
      ]);

      if (!!password) {
        dispatch({ type: "setPasscode", newPasscode: password });
        // dispatch({type:'setAuthStatus',newAuthStatus:'pending'})
      }

      if (appMode === "kill") {
        dispatch({ type: "toggleAppMode", newAppMode: appMode });
      } else if (appMode === "normal") {
        dispatch({ type: "toggleAppMode", newAppMode: appMode });
      }
    }

    initialize();
  }, []);

  async function loadInitialState() {
    return;
  }

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
