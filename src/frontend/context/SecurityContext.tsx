import * as React from "react";

import { OBSCURE_KEY, OBSCURE_PASSCODE, PASSWORD_KEY } from "../constants";
import createPersistedState from "../hooks/usePersistedState";

type AuthState = "unauthenticated" | "authenticated" | "obscured";

type AuthSetters =
  | { type: "passcode"; value: string | null }
  //This is to set up the future use of the obscure pass beings set by the user. if the `value` is undefined, the default obscure pass is being used
  | { type: "obscure"; value?: string | null };

type AuthValuesSet = {
  passcodeSet: boolean;
  obscureSet: boolean;
};

type SecurityContextType = {
  authValuesSet: AuthValuesSet;
  setAuthValues: (val: AuthSetters) => void;
  authenticate: (val: string | null, validateOnly?: boolean) => boolean;
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

  const setPasscodeWithValidation = React.useCallback(
    (passcodeValue: string | null) => {
      // If user is able to set their own obscure passcode get rid of this if statement.
      if (passcodeValue === OBSCURE_PASSCODE) {
        throw new Error("passcode is reserved");
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
    []
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

  const authenticate = React.useCallback(
    (passcodeValue: string | null, validateOnly: boolean = false) => {
      if (validateOnly) {
        if (passcodeValue === passcode) {
          return true;
        }

        return false;
      }

      if (passcodeValue === obscureCode) {
        setAuthState("obscured");
        return true;
      }

      if (passcodeValue === passcode) {
        setAuthState("authenticated");
        return true;
      }

      throw new Error("Incorrect Passcode");
    },
    [passcode, obscureCode]
  );

  const setAuthValues = React.useCallback(
    ({ type, value }: AuthSetters) => {
      if (type === "passcode") setPasscodeWithValidation(value);
      else setObscureCodeWithValidation(value);
    },
    [setPasscodeWithValidation, setObscureCodeWithValidation]
  );

  const contextValue: SecurityContextType = React.useMemo(
    () => ({
      authValuesSet: {
        passcodeSet: passcode !== null,
        obscureSet: obscureCode !== null,
      },
      setAuthValues,
      authenticate,
      authState,
    }),
    [setAuthValues, authenticate, passcode, obscureCode, authState]
  );

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

function validPasscode(passcode: string | null): boolean {
  if (passcode === null) return true;
  return passcode.length === 5 && !isNaN(parseInt(passcode!, 10));
}
