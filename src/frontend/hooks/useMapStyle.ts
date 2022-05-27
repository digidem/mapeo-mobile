import * as React from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";
import ky from "ky";

import api from "../api";
import { useExperiments } from "./useExperiments";
import { normalizeStyleURL } from "../lib/mapbox";
import config from "../../config.json";

import {
  fallbackStyleURL,
  MapStyleContext,
  MapStyleContextType,
  MapTypes,
  OnlineState,
  onlineStyleURL,
} from "../context/MapStyleContext";
import { DEFAULT_MAP_ID } from "../screens/Settings/MapSettings/BackgroundMaps";

type LegacyCustomMapState = "unknown" | "unavailable" | "available";
type SetStyleId = (id: string) => void;
type MapStyleState =
  | {
      styleUrl: null | string;
      defaultStyleUrl?: null | string;
      styleType: Extract<MapTypes, "loading">;
      setStyleId: SetStyleId;
    }
  | {
      styleUrl: null | string;
      defaultStyleUrl?: null | string;
      styleType: Exclude<MapTypes, "loading">;
      setStyleId: SetStyleId;
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
  onlineMapState,
}: MapStyleContextType): MapStyleState {
  return React.useMemo(() => {
    const defaultStyleUrl =
      onlineMapState === "online" ? onlineStyleURL : fallbackStyleURL;

    if (!mapServerReady) {
      return {
        styleType: "loading",
        styleUrl: null,
        defaultStyleUrl: null,
        setStyleId,
      };
    }

    if (typeof styleId !== "string") {
      return {
        styleType: "loading",
        styleUrl: defaultStyleUrl,
        defaultStyleUrl,
        setStyleId,
      };
    }

    if (styleId === DEFAULT_MAP_ID) {
      return {
        styleType: "mapServer",
        styleUrl: defaultStyleUrl,
        defaultStyleUrl,
        setStyleId,
      };
    }

    return {
      styleType: "mapServer",
      styleUrl: api.maps.getStyleUrl(styleId) || null,
      defaultStyleUrl,
      setStyleId,
    };
  }, [styleId, setStyleId, mapServerReady, onlineMapState]);
}

export function useMapStyle(styleId: string = "default"): MapStyleState {
  const [{ backgroundMaps }] = useExperiments();
  const mapStyleInfo = React.useContext(MapStyleContext);
  const legacyStyleInfo = useLegacyStyle(mapStyleInfo.onlineMapState);
  const mapServerInfo = useMapServerStyle(mapStyleInfo);

  return backgroundMaps ? mapServerInfo : legacyStyleInfo;
}
