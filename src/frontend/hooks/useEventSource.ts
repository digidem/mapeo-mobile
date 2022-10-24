import { useEffect, useRef } from "react";
import {
  fetchEventSource,
  FetchEventSourceInit,
} from "@microsoft/fetch-event-source";
import "fast-text-encoding";

global.window = Object.assign(global.window || {}, {
  setTimeout,
  clearTimeout,
  fetch,
});

global.document = Object.assign(global.document || {}, {
  hidden: false,
  addEventListener: () => {},
  removeEventListener: () => {},
});

export const useEventSource = (
  // TODO: Should fix this at the app level, where the maps api is only available if the port is known
  url: string | undefined,
  options: Omit<FetchEventSourceInit, "signal">
) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!url) return;

    console.log("CREATING EVENT SOURCE", url);

    const controller = new AbortController();

    abortControllerRef.current = controller;

    fetchEventSource(url, {
      ...options,
      signal: controller.signal,
    });

    return () => {
      console.log("ABORTING CLEANUP");
      controller.abort();
      abortControllerRef.current = null;
    };
  }, [url, options]);

  return () => {
    console.log("ABORTING UNSUB");
    abortControllerRef.current?.abort();
  };
};
