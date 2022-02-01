import * as React from "react";

interface SecuritContextType {
  killState: boolean;
  setKillState: React.Dispatch<React.SetStateAction<boolean>>;
  passcode?: string;
  setPasscode: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const DEFAULT_CONTEXT: SecuritContextType = {
  killState: false,
  setKillState: () => {},
  setPasscode: () => {},
};

const SecurityContext = React.createContext<SecuritContextType>(
  DEFAULT_CONTEXT
);

export const SecurityProvider = (children: React.ReactNode) => {
  const [killState, setKillState] = React.useState(false);
  const [passcode, setPasscode] = React.useState<string | undefined>();

  const contextValues: SecuritContextType = React.useMemo(() => {
    return { killState, setKillState, setPasscode, passcode };
  }, [killState, passcode]);

  return (
    <SecurityContext.Provider value={contextValues}>
      {children}
    </SecurityContext.Provider>
  );
};
