import * as React from "react";

import api from "../api";
import { useExperiments } from "./useExperiments";

import { MapStyleContext, MapTypes } from "../context/MapStyleContext";
import { DEFAULT_MAP_ID } from "../screens/Settings/MapSettings/BackgroundMaps";
import { useDefaultStyleUrl } from "./useDefaultStyleUrl";

type LegacyCustomMapState = "unknown" | "unavailable" | "available";
type SetStyleId = (id: string) => void;
type MapStyleState = {
  styleUrl: null | string;
  styleType: MapTypes;
  setStyleId: SetStyleId;
  styleId?: string;
};

function useLegacyStyle(defaultMap: string): MapStyleState {
  const [customMapState, setCustomMapState] = React.useState<
    LegacyCustomMapState
  >("unknown");

  React.useEffect(() => {
    let didCancel = false;

    api
      .getMapStyle("default")
      .then(() => didCancel || setCustomMapState("available"))
      .catch(() => didCancel || setCustomMapState("unavailable"));

    return () => {
      didCancel = true;
    };
  }, []);

  return React.useMemo(() => {
    const setStyleId = (id: string) => {
      throw new Error("Cannot set styleId on legacy map");
    };

    if (customMapState === "unknown") {
      return { styleType: "loading", styleUrl: null, setStyleId };
    }

    if (customMapState === "available") {
      return {
        styleType: "custom",
        styleUrl: api.getMapStyleUrl("default"),
        setStyleId,
      };
    }

    return { styleType: "fallback", styleUrl: defaultMap, setStyleId };
  }, [defaultMap, customMapState]);
}

function useMapServerStyle(defaultStyleUrl: string): MapStyleState {
  const { mapServerReady, setStyleId, styleId } = React.useContext(
    MapStyleContext
  );

  return React.useMemo(() => {
    if (!mapServerReady) {
      return {
        styleType: "loading",
        styleUrl: null,
        setStyleId,
      };
    }

    if (styleId === DEFAULT_MAP_ID) {
      return {
        styleType: "mapServer",
        styleUrl: defaultStyleUrl,
        setStyleId,
        styleId,
      };
    }

    return {
      styleType: "mapServer",
      styleUrl: api.maps.getStyleUrl(styleId) || null,
      setStyleId,
      styleId,
    };
  }, [styleId, setStyleId, mapServerReady, defaultStyleUrl]);
}

export function useMapStyle(styleId: string = "default"): MapStyleState {
  const [{ backgroundMaps }] = useExperiments();
  const defaultStyleUrl = useDefaultStyleUrl();
  const legacyStyleInfo = useLegacyStyle(defaultStyleUrl);
  const mapServerInfo = useMapServerStyle(defaultStyleUrl);

  return backgroundMaps ? mapServerInfo : legacyStyleInfo;
}
