import * as React from "react";

//We should be setting the password to null when the password is turned off
interface SecuritContextType {
  killState: boolean;
  setKillState: React.Dispatch<React.SetStateAction<boolean>>;
  passcode: string | null;
  setPasscode: React.Dispatch<React.SetStateAction<string | null>>;
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

  const contextValues: SecuritContextType = React.useMemo(() => {
    return { killState, setKillState, setPasscode, passcode };
  }, [killState, passcode]);

  return (
    <SecurityContext.Provider value={contextValues}>
      {children}
    </SecurityContext.Provider>
  );
};
