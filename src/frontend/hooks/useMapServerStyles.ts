import React from "react";
import api from "../api";
import { MapStyleContext } from "../context/MapStyleContext";

import { MapImportsStateContext } from "../context/MapImportsContext";
import { MapServerStyleInfo, Status } from "../sharedTypes";
import { DEFAULT_MAP_ID } from "../screens/Settings/MapSettings/BackgroundMaps";
import { useDefaultStyleUrl } from "./useDefaultStyleUrl";

interface StyleInfoWithImport extends MapServerStyleInfo {
  importInfo?: {
    id: string;
    progressUrl: string;
    errored: boolean;
  };
}

type FetchStatus = Exclude<Status, void | "idle">;

export function useMapServerStyles() {
  const { setStyleId, styleId } = React.useContext(MapStyleContext);
  const defaultStyleUrl = useDefaultStyleUrl();
  const imports = React.useContext(MapImportsStateContext);
  const [stylesList, setStylesList] = React.useState<StyleInfoWithImport[]>([]);
  const [status, setStatus] = React.useState<FetchStatus>("loading");

  React.useEffect(() => {
    let cancelled = false;

    async function getStyles() {
      try {
        const styles = await api.maps.getStyleList();

        if (cancelled) return;

        // const stylesWithImportState = styles.map(s => {
        //   // return { ...s, isImporting: !!imports[s.id] };
        //   return { ...s, importId: imports[s.id] };
        // });

        const newStylesList = await Promise.all(
          styles.map(async s => {
            const importId = imports[s.id];

            if (!importId) return s;

            const importProgressUrl = await api.maps.getImportProgressUrl(
              importId
            );

            const importRecord = await api.maps.getImport(importId);

            return {
              ...s,
              importInfo: {
                id: importId,
                progressUrl: importProgressUrl,
                errored: !!importRecord.error,
              },
            };
          })
        );

        setStylesList(newStylesList);
        setStatus("success");
      } catch (_err) {
        // TODO: Bugsnag
        setStatus("error");
      }
    }

    getStyles();

    return () => {
      cancelled = true;
    };
  }, [styleId, defaultStyleUrl, imports]);

  const defaultStyle: StyleInfoWithImport = React.useMemo(
    () => ({
      id: DEFAULT_MAP_ID,
      url: defaultStyleUrl,
      bytesStored: 0,
      name: "Default",
    }),
    [defaultStyleUrl]
  );

  return {
    styles: [defaultStyle, ...stylesList],
    setSelectedStyleId: setStyleId,
    selectedStyleId: styleId,
    status,
  };
}
