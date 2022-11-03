import { useContext } from "react";
import {
  MapImportsStateContext,
  MapImportsActionsContext,
} from "../context/MapImportsContext";

export function useMapImports() {
  const activeImports = useContext(MapImportsStateContext);
  return activeImports;
}

export function useMapImportsManager() {
  const dispatch = useContext(MapImportsActionsContext);

  return {
    add: (payload: { styleId: string; importId: string }[]) =>
      dispatch({ type: "add", payload }),
    remove: (payload: string[]) => dispatch({ type: "remove", payload }),
  };
}
