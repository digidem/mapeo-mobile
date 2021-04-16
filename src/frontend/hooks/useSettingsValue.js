// @flow
import React from "react";
import SettingsContext, {
  type SettingsState,
} from "../context/SettingsContext";

export default function useSettingsValue(key: $Keys<SettingsState>) {
  const [state] = React.useContext(SettingsContext);
  return state[key];
}
