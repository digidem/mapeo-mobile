import * as React from "react";
import SettingsContext, { SettingsState } from "../context/SettingsContext";

export default function useSettingsValue<K extends keyof SettingsState>(
  key: K
): SettingsState[K] {
  const [state] = React.useContext(SettingsContext);
  return state[key];
}
