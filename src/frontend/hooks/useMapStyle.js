// @flow
import { useEffect, useState, useMemo } from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";
import api from "../api";
import ky from "ky";

const fallbackStyleURL = MapboxGL.StyleURL.Outdoors;

export default function useMapstyleURL(styleId: string = "default") {
  const [loading, setLoading] = useState(true);
  const [styleURL, setStyleURL] = useState();
  const [error, setError] = useState();
  const [offlineFailed, setOfflineFailed] = useState(false);

  useEffect(() => {
    let didCancel = false;
    // try offline first, if that fails then try online fallback url
    const getStylePromise = offlineFailed
      ? ky.get(fallbackStyleURL).json()
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
        console.log("That was useMapStyle", didCancel);
        if (didCancel) return;
        setStyleURL(styleURL);
        setLoading(false);
        setError(false);
      })
      .catch(err => {
        console.log("Style load error", styleURL, err);
        if (didCancel) return;
        if (!offlineFailed) {
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
    error
  ]);
}
