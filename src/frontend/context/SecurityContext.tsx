import * as React from "react";

import { PASSWORD_KEY } from "../constants";
import createPersistedState from "../hooks/usePersistedState";
import SettingsContext from "./SettingsContext";

type AuthState =
  | "unauthenticated"
  | "authenticated"
  | "notRequired"
  | "obscured";

type SecurityContextType = {
  authState: AuthState;
  passcode: string | null;
  setPasscode: (val: string | null) => void;
  setAuthState: (val: AuthState) => void;
};

const DefaultState: SecurityContextType = {
  authState: "notRequired",
  passcode: null,
  setPasscode: () => {},
  setAuthState: () => {},
};

export const SecurityContext = React.createContext<SecurityContextType>(
  DefaultState
);

const usePersistedPasscodeState = createPersistedState(PASSWORD_KEY);

export const SecurityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authState, setAuthState] = React.useState<AuthState>("notRequired");
  const [{ obscurityPassEnabled }, setState] = React.useContext(
    SettingsContext
  );
  const [passcode, status, setPasscode] = usePersistedPasscodeState<
    string | null
  >(null);

  React.useEffect(() => {
    console.log(passcode);
    if (passcode === null) {
      setAuthState("notRequired");
      return;
    }
    setAuthState("authenticated");
  }, [passcode]);

  const setPasscodeWithValidation = React.useCallback(
    (passcodeValue: string | null) => {
      if (!passcodeValue && obscurityPassEnabled) {
        setState("obscurityPassEnabled", false);
      }

      if (!validPasscode(passcodeValue)) {
        throw new Error("passcode not valid");
      }

      setPasscode(passcodeValue);
    },
    [obscurityPassEnabled]
  );

  const setAuthStateWithValidation = React.useCallback(
    (authStateValue: AuthState) => {
      if (authStateValue === "obscured" && !obscurityPassEnabled) {
        throw new Error("obscure mode not enabled");
      }

      setAuthState(authStateValue);
    },
    [obscurityPassEnabled]
  );

  const contextValue: SecurityContextType = React.useMemo(
    () => ({
      passcode,
      authState,
      setAuthState: setAuthStateWithValidation,
      setPasscode: setPasscodeWithValidation,
    }),
    [passcode, authState, setAuthStateWithValidation, setPasscodeWithValidation]
  );

  return (
    <SecurityContext.Provider value={contextValue}>
      {status === "loading" ? null : children}
    </SecurityContext.Provider>
  );
};

function validPasscode(passcode: string | null): boolean {
  if (passcode === null) return true;
  return passcode.length === 5 && !isNaN(parseInt(passcode!, 10));
}
