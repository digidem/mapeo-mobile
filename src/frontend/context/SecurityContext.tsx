import * as React from "react";

import { OBSCURE_KEY, OBSCURE_PASSCODE, PASSWORD_KEY } from "../constants";
import createPersistedState from "../hooks/usePersistedState";

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
  authenticate: (val: string | null, validateOnly?: boolean) => boolean;
  obscureModeOn: boolean;
};

const DefaultState: SecurityContextType = {
  authValuesSet: { passcodeSet: false, obscureSet: false },
  setAuthValues: () => {},
  authenticate: () => false,
  obscureModeOn: false,
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
  const [obscureModeOn, setObscureModeOn] = React.useState(false);

  const [obscureCode, , setObscureCode] = usePersistedObscureState<
    string | null
  >(null);

  const passcodeSet = passcode !== null;
  const obscureSet = obscureCode !== null;

  const setPasscodeWithValidation = React.useCallback(
    (passcodeValue: string | null) => {
      // If user is able to set their own obscure passcode get rid of this if statement.
      if (passcodeValue === OBSCURE_PASSCODE) {
        throw new Error("passcode is reserved");
      }

      if (passcode !== null && passcodeValue === obscureCode) {
        throw new Error("passcode is already being used obscure code");
      }

      if (!validPasscode(passcodeValue)) {
        throw new Error("passcode not valid");
      }

      if (passcodeValue === null) {
        setObscureCode(null);
      }

      setPasscode(passcodeValue);
    },
    [obscureCode, passcode]
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

      if (newObscureVal === null && obscureModeOn) {
        setObscureModeOn(false);
      }

      setObscureCode(newObscureVal);
    },
    [passcode, obscureModeOn]
  );

  const authenticate = React.useCallback(
    (passcodeValue: string | null, validateOnly: boolean = false) => {
      if (validateOnly || !obscureSet) return passcodeValue === passcode;

      if (passcodeValue === passcode) {
        setObscureModeOn(false);
        return true;
      }

      if (passcodeValue === obscureCode && obscureSet) {
        setObscureModeOn(true);
        return true;
      }

      return false;
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
        passcodeSet,
        obscureSet,
      },
      setAuthValues,
      authenticate,
      obscureModeOn,
    }),
    [setAuthValues, authenticate, passcodeSet, obscureCode, obscureSet]
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
