import * as React from "react";
import {
  BackgroundedMapImportsStateContext,
  BackgroundedMapImportsActionsContext,
} from "../context/BackgroundedMapImportsContext";

export function useBackgroundedMapImports() {
  const activeImports = React.useContext(BackgroundedMapImportsStateContext);
  return activeImports;
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
  }, [importIdRef]);

  React.useEffect(() => {
    // If this component mounts, it means the import is no longer backgrounded
    if (styleIdRef.current) {
      dispatch({ type: "remove", payload: { styleId } });
    }

    return () => {
      // Add the import to the background when the consumer of this hook unmounts
      if (styleIdRef.current && importIdRef.current) {
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
