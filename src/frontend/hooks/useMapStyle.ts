import * as React from "react";

import api from "../api";
import { MapTypes } from "../context/MapStyleContext";
import { DEFAULT_MAP_ID } from "../screens/Settings/MapSettings/BackgroundMaps";
import { useDefaultStyleUrl } from "./useDefaultStyleUrl";
import { useExperiments } from "./useExperiments";
import { useMapServerStyles } from "./useMapServerStyles";

type LegacyCustomMapState = "unknown" | "unavailable" | "available";

type MapStyleState =
  | {
      styleUrl: null;
      styleType: Extract<MapTypes, "loading">;
    }
  | {
      styleUrl: string;
      styleType: Exclude<MapTypes, "loading">;
      styleId: string | null;
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
    if (customMapState === "unknown") {
      return { styleType: "loading", styleUrl: null };
    }

    if (customMapState === "available") {
      return {
        styleType: "custom",
        styleUrl: api.getMapStyleUrl("default"),
        styleId: null,
      };
    }

    return { styleType: "fallback", styleUrl: defaultMap, styleId: null };
  }, [defaultMap, customMapState]);
}

function useMapServerStyle(defaultStyleUrl: string): MapStyleState {
  const { status, selectedStyleId } = useMapServerStyles();
  const [styleUrl, setStyleUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        if (!selectedStyleId) return;

        if (selectedStyleId === DEFAULT_MAP_ID) {
          setStyleUrl(defaultStyleUrl);
          return;
        }

        const styleUrl = await api.maps.getStyleUrl(selectedStyleId);

        setStyleUrl(styleUrl);
      } catch (err) {
        // TODO: Bugsnag
        console.log(err);
      }
    })();
  }, [status, selectedStyleId, defaultStyleUrl]);

  if (status === "loading") {
    return {
      styleType: "loading",
      styleUrl: null,
    };
  }

  return {
    styleId: selectedStyleId,
    styleType: "mapServer",
    styleUrl: styleUrl || defaultStyleUrl,
  };
}

export function useMapStyle(): MapStyleState {
  const [{ backgroundMaps }] = useExperiments();
  const defaultStyleUrl = useDefaultStyleUrl();
  const legacyStyleInfo = useLegacyStyle(defaultStyleUrl);
  const mapServerInfo = useMapServerStyle(defaultStyleUrl);

  return backgroundMaps ? mapServerInfo : legacyStyleInfo;
}
