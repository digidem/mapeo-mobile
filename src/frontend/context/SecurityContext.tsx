import * as React from "react";

//We should be setting the password to null when the password is turned off
interface SecuritContextType {
  killState: boolean;
  setKillState: (killStateValue: boolean) => void;
  passcode: string | null;
  setPasscode: (passValue: string | null) => void;
}

const DEFAULT_CONTEXT: SecuritContextType = {
  killState: false,
  setKillState: () => {},
  setPasscode: () => {},
  passcode: null,
};

export const SecurityContext = React.createContext<SecuritContextType>(
  DEFAULT_CONTEXT
);

export const SecurityProvider = (children: React.ReactNode) => {
  const [killState, setKillState] = React.useState(false);
  const [passcode, setPasscode] = React.useState<string | null>(null);

  //checks that the user has a passcode set before setting kill state
  const setKillStateWithCheck = React.useCallback(
    (newState: boolean) => {
      if (!passcode && newState) {
        throw new Error("Cannot set kill state without a passcode");
      }

      setKillState(newState);
    },
    [setKillState, passcode]
  );

  const setPasscodeWithCheck = React.useCallback(
    (passcode: string | null) => {
      if (!passcode) {
        setKillState(false);
      } else {
        if (!validPasscode(passcode)) {
          throw new Error("passcode not valid");
        } else {
          setPasscode(passcode);
        }
      }
    },
    [setPasscode, setKillState]
  );

  const contextValues: SecuritContextType = React.useMemo(() => {
    return {
      killState,
      setKillState: setKillStateWithCheck,
      setPasscode: setPasscodeWithCheck,
      passcode,
    };
  }, [killState, passcode]);

  return (
    <SecurityContext.Provider value={contextValues}>
      {children}
    </SecurityContext.Provider>
  );
};

function validPasscode(passcode: string): boolean {
  return passcode.length === 5 && !isNaN(parseInt(passcode));
}
