// @flow
import { useEffect, useState, useMemo } from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";
import ky from "ky";
import debug from "debug";

import api from "../api";
import { normalizeStyleURL } from "../lib/mapbox";
import config from "../../config.json";

const log = debug("mapeo-mobile:useMapStyle");
const fallbackStyleURL = MapboxGL.StyleURL.Outdoors + "?" + Date.now();
let cachedStyleURL;

export default function useMapstyleURL(styleId: string = "default") {
  const [loading, setLoading] = useState(true);
  const [styleURL, setStyleURL] = useState(cachedStyleURL);
  const [error, setError] = useState(null);
  const [offlineFailed, setOfflineFailed] = useState(false);

  useEffect(() => {
    let didCancel = false;
    // try offline first, if that fails then try online fallback url
    const getStylePromise = offlineFailed
      ? ky
          .get(normalizeStyleURL(fallbackStyleURL, config.mapboxAccessToken))
          .json()
      : api.getMapStyle(styleId);
    const styleURL = offlineFailed
      ? fallbackStyleURL
      : api.getMapStyleUrl(styleId);

    // We don't use the map style (currently react-native-mapbox-gl does not
    // support passing a style object to the MapView) but we still try to load
    // it first to ensure it is available before passing it to the Map,
    // otherwise the map tries to initialise with a null style and crashes the
    // app
    getStylePromise
      .then(() => {
        if (didCancel) return;
        log("Using style URL: " + styleURL);
        cachedStyleURL = styleURL;
        setStyleURL(styleURL);
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        if (didCancel) return;
        if (!offlineFailed) {
          log("No offline style available");
          setOfflineFailed(true);
          return;
        }
        setError(err);
        setLoading(false);
      });

    return () => {
      didCancel = true;
    };
  }, [styleId, offlineFailed]);

  return useMemo(() => [{ loading, styleURL, error }], [
    loading,
    styleURL,
    error,
  ]);
}
