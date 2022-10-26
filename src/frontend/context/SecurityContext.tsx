import * as React from "react";
import { AppState, AppStateStatus } from "react-native";

import { OBSCURE_KEY, OBSCURE_PASSCODE, PASSWORD_KEY } from "../constants";
import createPersistedState from "../hooks/usePersistedState";

type AuthState = "unauthenticated" | "authenticated" | "obscured";

type AuthSetters =
  | { type: "passcode"; value: string | null }
  // This is to set up the future use of the obscure pass beings set by the user. if the `value` is undefined, the default obscure pass is being used
  | { type: "obscure"; value?: string | null };

type AuthValuesSet = {
  passcodeSet: boolean;
  obscureSet: boolean;
};

type SecurityContextType = {
  authValuesSet: AuthValuesSet;
  setAuthValues: (val: AuthSetters) => void;
  authenticate: (
    passcodeValue: string | null,
    validateOnly?: boolean
  ) => boolean;
  authState: AuthState;
};

const DefaultState: SecurityContextType = {
  authValuesSet: { passcodeSet: false, obscureSet: false },
  setAuthValues: () => {},
  authenticate: () => false,
  authState: "unauthenticated",
};

export const SecurityContext = React.createContext<SecurityContextType>(
  DefaultState
);

const usePersistedPasscodeState = createPersistedState(PASSWORD_KEY);
const usePersistedObscureState = createPersistedState(OBSCURE_KEY);

export const SecurityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [passcode, status, setPasscode] = usePersistedPasscodeState<
    string | null
  >(null);
  if (status === "loading") return null;
  return (
    <SecurityProviderInner passcode={passcode} setPasscode={setPasscode}>
      {children}
    </SecurityProviderInner>
  );
};

const SecurityProviderInner = ({
  children,
  passcode,
  setPasscode,
}: {
  children: React.ReactNode;
  passcode: string | null;
  setPasscode: React.Dispatch<React.SetStateAction<null | string>>;
}) => {
  const [authState, setAuthState] = React.useState<AuthState>(
    passcode === null ? "authenticated" : "unauthenticated"
  );

  const [obscureCode, , setObscureCode] = usePersistedObscureState<
    string | null
  >(null);

  const passcodeSet = passcode !== null;
  const obscureSet = obscureCode !== null;

  React.useEffect(() => {
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (passcodeSet) {
          if (
            nextAppState === "active" ||
            nextAppState === "background" ||
            nextAppState === "inactive"
          ) {
            setAuthState("unauthenticated");
          }
        }
      }
    );

    return () => appStateListener.remove();
  }, [passcodeSet]);

  const setPasscodeWithValidation = React.useCallback(
    (passcodeValue: string | null) => {
      // If user is able to set their own obscure passcode get rid of this if statement.
      if (passcodeValue === OBSCURE_PASSCODE) {
        throw new Error("passcode is reserved");
      }

      if (passcodeValue !== null && passcodeValue === obscureCode) {
        throw new Error("passcode is already being used obscure code");
      }

      if (!validPasscode(passcodeValue)) {
        throw new Error("passcode not valid");
      }

      if (passcodeValue === null) {
        setAuthState("authenticated");
        setObscureCode(null);
      }

      setPasscode(passcodeValue);
    },
    [obscureCode]
  );

  const setObscureCodeWithValidation = React.useCallback(
    (newObscureVal: string | null | undefined) => {
      if (passcode === null && newObscureVal !== null) {
        throw new Error("Cannot set obscure mode if passcode not set");
      }

      if (newObscureVal === undefined) {
        setObscureCode(OBSCURE_PASSCODE);
        return;
      }

      if (!validPasscode(newObscureVal) || newObscureVal === passcode) {
        throw new Error("passcode not valid");
      }

      setObscureCode(newObscureVal);
    },
    [passcode]
  );

  const authenticate: SecurityContextType["authenticate"] = React.useCallback(
    (passcodeValue, validateOnly = false) => {
      if (validateOnly) return passcodeValue === passcode;

      if (obscureSet && passcodeValue === obscureCode) {
        setAuthState("obscured");
        return true;
      }

      if (passcodeValue === passcode) {
        setAuthState("authenticated");
        return true;
      }

      throw new Error("Incorrect Passcode");
    },
    [passcode, obscureCode, obscureSet]
  );

  const setAuthValues: SecurityContextType["setAuthValues"] = React.useCallback(
    ({ type, value }) => {
      if (type === "passcode") setPasscodeWithValidation(value);
      else setObscureCodeWithValidation(value);
    },
    [setPasscodeWithValidation, setObscureCodeWithValidation]
  );

  const contextValue: SecurityContextType = React.useMemo(
    () => ({
      authValuesSet: {
        passcodeSet,
        obscureSet,
      },
      setAuthValues,
      authenticate,
      authState,
    }),
    [setAuthValues, authenticate, passcodeSet, obscureSet, authState]
  );

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

function validPasscode(passcode: string | null): boolean {
  if (passcode === null) return true;
  return passcode.length === 5 && !isNaN(parseInt(passcode, 10));
}
