import * as React from "react";
import SettingsContext from "../context/SettingsContext";

export function useExperiments() {
  const [{ experiments }, , setExperiments] = React.useContext(SettingsContext);
  return [experiments, setExperiments] as const;
}
