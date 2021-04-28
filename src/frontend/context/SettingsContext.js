// @flow
import * as React from "react";
import createPersistedState from "../hooks/usePersistedState";

// Increment if the shape of settings changes, but try to avoid doing this
// because it will reset everybody's settings back to the defaults = bad :(
const STORE_KEY = "@MapeoSettings@1";

export type CoordinateFormat = "utm" | "dd" | "dms";
export type ExperimentalP2pUpgrade = boolean;

export type SettingsState = {
  coordinateFormat: CoordinateFormat,
  experiments: {
    p2pUpgrade: boolean,
  },
};

type SettingsContextType = [
  SettingsState,
  (key: $Keys<SettingsState>, value: any) => void
];

const DEFAULT_SETTINGS = {
  coordinateFormat: "utm",
  experiments: {
    p2pUpgrade: false,
  },
};

const SettingsContext = React.createContext<SettingsContextType>([
  DEFAULT_SETTINGS,
  () => {},
]);

const usePersistedState = createPersistedState(STORE_KEY);

export const SettingsProvider = ({ children }: { children: React.Node }) => {
  const [state, status, setState] = usePersistedState<SettingsState>(
    DEFAULT_SETTINGS
  );

  const setSettings = React.useCallback(
    // $FlowFixMe This is not broken, Flow is just wrong: https://medium.com/flow-type/spreads-common-errors-fixes-9701012e9d58 #timetoswitchtoTS
    (key, value) => setState({ ...state, [key]: value }),
    [setState, state]
  );

  const contextValue = React.useMemo(() => [state, setSettings], [
    state,
    setSettings,
  ]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {status === "loading" ? null : children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
