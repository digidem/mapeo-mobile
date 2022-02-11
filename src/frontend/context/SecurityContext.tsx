import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ASYNC_KILL_KEY, PASSWORD_KEY } from "../constants";
import { useEffect } from "react";
import { useRef } from "react";

//We should be setting the password to null when the password is turned off
interface SecuritContextType {
  killState: boolean;
  setKillState: (killStateValue: boolean) => void;
  passcode: string | null;
  setPasscode: (passValue: string | null) => void;
  checkFlag: boolean;
  killStateActive: boolean;
  setKillStateActive: (isActive: boolean) => void;
  setCheckFlag: (checkFlag: boolean) => void;
}

const DEFAULT_CONTEXT: SecuritContextType = {
  killState: false,
  setKillState: () => {},
  setPasscode: () => {},
  passcode: null,
  checkFlag: false,
  setCheckFlag: () => {},
  killStateActive: false,
  setKillStateActive: () => {},
};

export const SecurityContext = React.createContext<SecuritContextType>(
  DEFAULT_CONTEXT
);

export const SecurityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [killState, setKillState] = React.useState(false);
  const [killStateActive, setKillStateActive] = React.useState(false);
  const [passcode, setPasscode] = React.useState<string | null>(null);
  const [checkFlag, setCheckFlag] = React.useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      AsyncStorage.getItem(PASSWORD_KEY, (err, val) => {
        if (!!val) {
          setPasscode(val);
          setCheckFlag(true);
          AsyncStorage.getItem(ASYNC_KILL_KEY, (err, val) => {
            if (!!val) setKillStateActive(val === "true");
          });
        } else {
          firstRender.current = false;
        }
      });
    }
  }, []);

  useEffect(() => {
    //Checks if the pass is just being set from initial render
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!passcode) {
      setKillState(false);
      setKillStateActive(false);
      setCheckFlag(false);
      AsyncStorage.setItem(PASSWORD_KEY, "");
    } else {
      AsyncStorage.setItem(PASSWORD_KEY, passcode);
    }
  }, [passcode]);

  useEffect(() => {
    AsyncStorage.setItem(ASYNC_KILL_KEY, JSON.stringify(killStateActive));
  }, [killStateActive]);

  //checks that the user has a passcode set before setting kill state
  const setKillStateActiveWithCheck = React.useCallback(
    (newState: boolean) => {
      if (!passcode && newState) {
        throw new Error("Cannot set kill state without a passcode");
      }
      setKillStateActive(newState);
    },
    [setKillStateActive, passcode]
  );

  //validates passcode
  const setPasscodeWithCheck = (passcode: string | null) => {
    if (!passcode) {
      setPasscode(null);
    } else {
      if (!validPasscode(passcode)) {
        throw new Error("passcode not valid");
      } else {
        setPasscode(passcode);
      }
    }
  };

  const contextValues: SecuritContextType = React.useMemo(() => {
    return {
      killState,
      setKillState,
      setPasscode: setPasscodeWithCheck,
      checkFlag,
      setCheckFlag,
      passcode,
      killStateActive,
      setKillStateActive: setKillStateActiveWithCheck,
    };
  }, [killState, passcode, checkFlag, killStateActive]);

  return (
    <SecurityContext.Provider value={contextValues}>
      {children}
    </SecurityContext.Provider>
  );
};

function validPasscode(passcode: string): boolean {
  return passcode.length === 5 && !isNaN(parseInt(passcode));
}
