import { useContext, useMemo } from "react";
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

  // Memoize in case this context gets put inside another context that changes a lot.
  return useMemo(() => {
    return {
      add: ({ styleId, importId }: { styleId: string; importId: string }) =>
        dispatch({ type: "add", styleId, importId }),
      remove: (styleId: string) => dispatch({ type: "remove", styleId }),
    };
  }, [dispatch]);
}
