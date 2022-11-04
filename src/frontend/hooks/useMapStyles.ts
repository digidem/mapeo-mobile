import React from "react";
import api from "../api";

import { MapImportsStateContext } from "../context/MapImportsContext";
import { MapServerStyleInfo } from "../sharedTypes";
import { useExperiments } from "./useExperiments";
import { useMapAvailability, onlineStyleURL } from "./useMapAvailability";
import useSettingsValue from "./useSettingsValue";
import SettingsContext from "../context/SettingsContext";

interface StyleInfoWithImport extends MapServerStyleInfo {
  isImporting: boolean;
}

// Randomly generated, but should not change, since this is stored in settings
// if the user selects one of these "legacy" map styles
export const DEFAULT_MAP_ID = "487x2pc8ws801avhs5hw58qnxc" as const;
export const CUSTOM_MAP_ID = "vg4ft8yvzwfedzgz1dz7ntneb8" as const;

type Status = "loading" | "error" | "success";
type StylesAtLeastOne = [StyleInfoWithImport, ...StyleInfoWithImport[]];

/**
 * Returns list of available map styles. If the backgroundMaps experiment is not
 * enabled then this is always a single item - either the default online map or
 * the custom map is available
 */
export function useMapStyles() {
  const customStyleAvailability = useMapAvailability("custom");
  const [{ backgroundMaps }] = useExperiments();
  const activeImports = React.useContext(MapImportsStateContext);
  const [settings, setSettings] = React.useContext(SettingsContext);
  const [stylesList, setStylesList] = React.useState<StyleInfoWithImport[]>([]);
  // There is nothing to load if background maps experiment is not enabled
  const [status, setStatus] = React.useState<Status>(
    backgroundMaps ? "loading" : "success"
  );

  React.useEffect(() => {
    if (!backgroundMaps) return;
    let didCancel = false;
    api.maps
      .getStyleList()
      .then(styles => {
        if (didCancel) return;
        const stylesWithImportState = styles.map(s => {
          // Append importing state so we can filter out importing maps if needed
          return { ...s, isImporting: !!activeImports[s.id] };
        });
        setStylesList(stylesWithImportState);
        setStatus("success");
      })
      .catch(() => didCancel || setStatus("error"));

    return () => {
      didCancel = true;
    };
  }, [activeImports, backgroundMaps]);

  // Keeping this in-scope so we can add translated name later
  const defaultStyle: StyleInfoWithImport = React.useMemo(() => {
    return {
      id: DEFAULT_MAP_ID,
      url: onlineStyleURL,
      bytesStored: 0,
      name: "Default",
      isImporting: false,
    };
  }, []);

  const customStyle: StyleInfoWithImport = React.useMemo(() => {
    return {
      id: CUSTOM_MAP_ID,
      url: api.getMapStyleUrl("default"),
      bytesStored: 0,
      name: "Offline Map",
      isImporting: false,
    };
  }, []);

  const mergedStatus: Status =
    customStyleAvailability === "unknown" || status === "loading"
      ? "loading"
      : status;

  let styles: StylesAtLeastOne;

  if (backgroundMaps) {
    // Always show the online default style in MapServer. This is replaced with
    // fallback in the useMapStyle hook
    styles =
      customStyleAvailability === "available"
        ? [defaultStyle, customStyle, ...stylesList]
        : [defaultStyle, ...stylesList];
  } else {
    if (customStyleAvailability === "available") {
      styles = [customStyle];
    } else {
      styles = [defaultStyle];
    }
  }

  const setSelectedStyleId = React.useCallback(
    (styleId: string) => {
      setSettings("mapStyleId", styleId);
    },
    [setSettings]
  );

  let selectedStyleId = settings.mapStyleId;
  // If the user selected style is not available, default to the first in the
  // styles list.
  if (styles.find(style => style.id === selectedStyleId)) {
    selectedStyleId = styles[0].id;
  }

  return { styles, status: mergedStatus, selectedStyleId, setSelectedStyleId };
}
