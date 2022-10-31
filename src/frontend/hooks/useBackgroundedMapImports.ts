import * as React from "react";
import {
  BackgroundedMapImportsStateContext,
  BackgroundedMapImportsActionsContext,
} from "../context/BackgroundedMapImportsContext";
import { DEFAULT_MAP_ID } from "../screens/Settings/MapSettings/BackgroundMaps";

export function useBackgroundedMapImports() {
  const activeImports = React.useContext(BackgroundedMapImportsStateContext);
  return activeImports;
}

export function useBackgroundedMapImportsManager() {
  const dispatch = React.useContext(BackgroundedMapImportsActionsContext);

  return {
    add: (styleId: string, importId: string) =>
      dispatch({ type: "add", payload: { styleId, importId } }),
    remove: (styleId: string) =>
      dispatch({ type: "remove", payload: { styleId } }),
  };
}

export function useMapImportBackgrounder(styleId: string, importId?: string) {
  const styleIdRef = React.useRef(styleId);
  const importIdRef = React.useRef(importId);

  const dispatch = React.useContext(BackgroundedMapImportsActionsContext);

  React.useEffect(() => {
    styleIdRef.current = styleId;
  }, [styleId]);

  React.useEffect(() => {
    importIdRef.current = importId;
  }, [importId]);

  React.useEffect(() => {
    const isDefaultMap = styleIdRef.current === DEFAULT_MAP_ID;

    // If this component mounts, it means the import is no longer backgrounded
    if (styleIdRef.current && !isDefaultMap) {
      dispatch({ type: "remove", payload: { styleId } });
    }

    return () => {
      // Add the import to the background when the consumer of this hook unmounts
      if (!isDefaultMap && styleIdRef.current && importIdRef.current) {
        dispatch({
          type: "add",
          payload: {
            styleId: styleIdRef.current,
            importId: importIdRef.current,
          },
        });
      }
    };
  }, []);
}
