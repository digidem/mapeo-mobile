// @flow
import { useContext } from "react";

import PresetsContext, {
  type PresetWithFields
} from "../context/PresetsContext";
import { addFieldDefinitions } from "../lib/utils";

function compareStrings(a = "", b = "") {
  return a.toLowerCase().localeCompare(b.toLowerCase());
}

export default (): PresetWithFields[] => {
  const [{ presets, fields }] = useContext(PresetsContext);

  return (
    Array.from(presets.values())
      .sort((a, b) => {
        if (typeof a.sort !== "undefined" && typeof b.sort !== "undefined") {
          // If sort value is the same, then sort by name
          if (a.sort === b.sort) return compareStrings(a.name, b.name);
          // Lower sort numbers come before higher numbers
          else return a.sort - b.sort;
        } else if (typeof a.sort !== "undefined") {
          // If a has a sort field but b doesn't, a comes first
          return -1;
        } else if (typeof b.sort !== "undefined") {
          // if b has a sort field but a doesn't, b comes first
          return 1;
        } else {
          // if neither have sort defined, compare by name
          return compareStrings(a.name, b.name);
        }
      })
      // Only show presets where the geometry property includes "point"
      .filter(p => p.geometry.includes("point"))
      // Replace field ids with full field definitions
      .map(p => addFieldDefinitions(p, fields))
  );
};
