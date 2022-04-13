import * as React from "react";
import merge from "lodash/merge";

import createPersistedState from "../hooks/usePersistedState";

// Increment if the shape of settings changes, but try to avoid doing this
// because it will reset everybody's settings back to the defaults = bad :( It is
// not necessary to increment this if only adding new properties to the settings
// state, because we merge the default values into the persisted state.
const STORE_KEY = "@MapeoSettings@1";

export type CoordinateFormat = "utm" | "dd" | "dms";
export type ExperimentalP2pUpgrade = boolean;

export type SettingsState = {
  coordinateFormat: CoordinateFormat;
  experiments: {
    p2pUpgrade: boolean;
    onboarding: boolean;
    appPasscode: boolean;
    devExperiments: boolean;
  };
  directionalArrow: boolean;
};

type SettingsContextType = readonly [
  SettingsState,
  (key: keyof SettingsState, value: any) => void
];

const DEFAULT_SETTINGS: SettingsState = {
  coordinateFormat: "utm",
  experiments: {
    p2pUpgrade: false,
    onboarding: process.env.FEATURE_ONBOARDING === "true",
    appPasscode: process.env.FEATURE_PASSCODE === "true",
    devExperiments: process.env.FEATURE_DEV_EXPERIMENTS === "true",
  },
  directionalArrow: false,
};

const SettingsContext = React.createContext<SettingsContextType>([
  DEFAULT_SETTINGS,
  () => {},
]);

const usePersistedState = createPersistedState(STORE_KEY);

export const SettingsProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [state, status, setState] = usePersistedState<SettingsState>(
    DEFAULT_SETTINGS
  );

  const setSettings: SettingsContextType[1] = React.useCallback(
    (key, value) => setState(previous => ({ ...previous, [key]: value })),
    [setState]
  );

  const contextValue: SettingsContextType = React.useMemo(() => {
    // If we add any new properties to the settings state, they will be
    // undefined in a users' persisted state, so we merge in the defaults
    const mergedState = merge({}, DEFAULT_SETTINGS, state);
    return [mergedState, setSettings];
  }, [state, setSettings]);

  return (
    <SettingsContext.Provider value={contextValue}>
      {status === "loading" ? null : children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
