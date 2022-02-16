import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { PasscodeIntro } from "../screens/AppPasscode/NewPasscode/PasscodeIntro";
import { PASSWORD_KEY } from "../constants";

type AppModeTypes = "normal" | "kill";
type AuthStatusTypes = "pending" | "authenticated" | "notRequired";

type AuthState = {
  passcode: string | null;
  appMode: AppModeTypes;
  killCodeEnabled: boolean;
  authStatus: AuthStatusTypes;
};

type KillModeActions =
  | { type: "setPasscode"; newPasscode: string | null }
  | { type: "toggleAppMode"; newAppMode?: AppModeTypes }
  | { type: "toggleKillModeEnabled"; newKillValue?: boolean }
  | { type: "setAuthStatus"; newAuthStatus: AuthStatusTypes };

function killModeReducer(state: AuthState, action: KillModeActions): AuthState {
  switch (action.type) {
    case "setPasscode":
      const passcode = action.newPasscode;
      if (passcode === null || validPasscode(passcode)) {
        AsyncStorage.setItem(PASSWORD_KEY, passcode || "");
        return { ...state, passcode };
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
      if (
        !state.passcode &&
        (action.newKillValue ||
          (!action.newKillValue && !state.killCodeEnabled))
      ) {
        throw new Error('Cannot enable "killMode" until password has been set');
      }

      return {
        ...state,
        killCodeEnabled: !!action.newKillValue
          ? action.newKillValue
          : state.killCodeEnabled
          ? false
          : true,
      };
    case "setAuthStatus":
      return { ...state, authStatus: action.newAuthStatus };
  }
}

const DefaultState: AuthState = {
  appMode: "normal",
  authStatus: "pending",
  killCodeEnabled: false,
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

  const contextValue: SecurityContextType = React.useMemo(() => {
    return [state, dispatch];
  }, [state]);

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

function validPasscode(passcode: string): boolean {
  return passcode.length === 5 && !isNaN(parseInt(passcode, 10));
}
