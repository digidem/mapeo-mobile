import * as React from "react";

import api from "../api";
import { useExperiments } from "./useExperiments";

import {
  fallbackStyleURL,
  MapStyleContext,
  MapStyleContextType,
  MapTypes,
  OnlineState,
  onlineStyleURL,
} from "../context/MapStyleContext";
import { DEFAULT_MAP_ID } from "../screens/Settings/MapSettings/BackgroundMaps";
import { useDefaultStyleUrl } from "./useDefaultStyleUrl";

type LegacyCustomMapState = "unknown" | "unavailable" | "available";
type SetStyleId = (id: string) => void;
type MapStyleState =
  | {
      styleUrl: null | string;
      styleType: Exclude<MapTypes, "mapServer">;
      setStyleId: SetStyleId;
      styleId?: string;
    }
  | {
      styleUrl: null | string;
      styleType: Extract<MapTypes, "mapServer">;
      setStyleId: SetStyleId;
      styleId: string;
    };

function useLegacyStyle(onlineMapState: OnlineState): MapStyleState {
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
    if (onlineMapState === "unknown" || customMapState === "unknown") {
      return { styleType: "loading", styleUrl: null, setStyleId };
    } else if (customMapState === "available") {
      return {
        styleType: "custom",
        styleUrl: api.getMapStyleUrl("default"),
        setStyleId,
      };
    } else if (onlineMapState === "online") {
      return { styleType: "online", styleUrl: onlineStyleURL, setStyleId };
    } else {
      return { styleType: "fallback", styleUrl: fallbackStyleURL, setStyleId };
    }
  }, [onlineMapState, customMapState]);
}

function useMapServerStyle({
  styleId,
  setStyleId,
  mapServerReady,
}: MapStyleContextType): MapStyleState {
  const defaultStyleUrl = useDefaultStyleUrl();

  return React.useMemo(() => {
    if (!mapServerReady) {
      return {
        styleType: "loading",
        styleUrl: null,
        setStyleId,
      };
    }

    if (typeof styleId !== "string") {
      return {
        styleType: "loading",
        styleUrl: defaultStyleUrl,
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
  const mapStyleInfo = React.useContext(MapStyleContext);
  const legacyStyleInfo = useLegacyStyle(mapStyleInfo.onlineMapState);
  const mapServerInfo = useMapServerStyle(mapStyleInfo);

  return backgroundMaps ? mapServerInfo : legacyStyleInfo;
}
