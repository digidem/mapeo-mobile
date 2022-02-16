import * as React from "react";

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
  | { type: "toggleKillMode"; newKillValue?: boolean }
  | { type: "setAuthStatus"; newAuthStatus: AuthStatusTypes };

function killModeReducer(state: AuthState, action: KillModeActions): AuthState {
  switch (action.type) {
    case "setPasscode":
      return { ...state, passcode: action.newPasscode };
    case "toggleAppMode":
      return {
        ...state,
        appMode: !!action.newAppMode
          ? action.newAppMode
          : state.appMode === "kill"
          ? "normal"
          : "kill",
      };
    case "toggleKillMode":
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

type SecuritContextType = readonly [AuthState, React.Dispatch<KillModeActions>];

export const SecurityContext = React.createContext<SecuritContextType>([
  DefaultState,
  () => {},
]);

export const SecurityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = React.useReducer(killModeReducer, DefaultState);

  const contextValue: SecuritContextType = React.useMemo(() => {
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
