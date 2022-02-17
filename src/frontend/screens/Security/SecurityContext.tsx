//This is temporary until we determine how password is set
import * as React from "react";

interface SecurityContextType {
  passIsSet: boolean;
  setPassIsSet: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultSecurityContext = [false, () => {}];

//@ts-ignore
export const SecurityContext = React.createContext<SecurityContextType>(
  //@ts-ignore
  defaultSecurityContext
);

export const SecurityProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [passIsSet, setPassIsSet] = React.useState<boolean>(false);

  const contextValue = React.useMemo(() => {
    return { passIsSet, setPassIsSet };
  }, [passIsSet]);

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};
