import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { PASSWORD_KEY } from "../constants";

type AppModeTypes = "normal" | "kill";
type AuthStatusTypes = "pending" | "authenticated" | "notRequired";

type AuthState = {
  passcode: string | null;
  appMode: AppModeTypes;
  killModeEnabled: boolean;
  authStatus: AuthStatusTypes;
};

type KillModeActions =
  | { type: "setPasscode"; newPasscode: string | null }
  | { type: "toggleAppMode"; newAppMode?: AppModeTypes }
  | { type: "toggleKillModeEnabled"; newKillModeValue?: boolean }
  | { type: "setAuthStatus"; newAuthStatus: AuthStatusTypes };

function killModeReducer(state: AuthState, action: KillModeActions): AuthState {
  switch (action.type) {
    case "setPasscode":
      const passcode = action.newPasscode;
      if (passcode === null || validPasscode(passcode)) {
        AsyncStorage.setItem(PASSWORD_KEY, passcode || "");
        if (!passcode) {
          return { ...state, passcode, authStatus: "notRequired" };
        }
        return { ...state, passcode, authStatus: "authenticated" };
      }
      throw new Error("Invalid New Password");
    case "toggleAppMode":
      return {
        ...state,
        appMode: !!action.newAppMode
          ? action.newAppMode
          : state.appMode === "kill"
          ? "normal"
          : "kill",
      };
    case "toggleKillModeEnabled":
      //will throw an error if the user does NOT have a password AND if the user is trying to set killMode to true
      //With the killMode dispatch code, the user does not have to explicity set a value for kill mode
      //If there is no value set, the kill mode just toggles, hence why I am checking if the value is
      //explicitly being set to true, OR if it is not being set and kill mode is CURRENTLY false (and therfore will be set to true)
      if (
        !state.passcode &&
        (action.newKillModeValue ||
          (action.newKillModeValue === undefined && !state.killModeEnabled))
      ) {
        throw new Error('Cannot enable "killMode" until password has been set');
      }

      return {
        ...state,
        killModeEnabled: !!action.newKillModeValue
          ? action.newKillModeValue
          : state.killModeEnabled
          ? false
          : true,
      };
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
  React.Dispatch<KillModeActions>
];

export const SecurityContext = React.createContext<SecurityContextType>([
  DefaultState,
  () => {},
]);

export const SecurityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = React.useReducer(killModeReducer, DefaultState);

  React.useEffect(() => {
    console.log(state);
  }, [state]);
  // const contextValue: SecurityContextType = React.useMemo(() => {
  //   return [state, dispatch];
  // }, [state, dispatch]);

  return (
    <SecurityContext.Provider value={[state, dispatch]}>
      {children}
    </SecurityContext.Provider>
  );
};

function validPasscode(passcode: string): boolean {
  return passcode.length === 5 && !isNaN(parseInt(passcode, 10));
}
