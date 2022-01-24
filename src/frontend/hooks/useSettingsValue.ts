import * as React from "react";
import SettingsContext, { SettingsState } from "../context/SettingsContext";

export default function useSettingsValue(key: keyof SettingsState) {
  const [state] = React.useContext(SettingsContext);
  return state[key];
}
