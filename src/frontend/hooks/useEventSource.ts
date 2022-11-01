import { useEffect, useRef } from "react";
import {
  fetchEventSource,
  FetchEventSourceInit,
} from "@microsoft/fetch-event-source";
// TODO: Ideally create module defs for this
// @ts-ignore
import { fetch } from "react-native-fetch-api";

export const useEventSource = (
  // TODO: Should fix this at the app level, where the maps api is only available if the port is known
  url: string | undefined,
  createOptions?: (cancel: () => void) => Omit<FetchEventSourceInit, "signal">
) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    abortControllerRef.current = controller;

    const options = createOptions
      ? createOptions(() => {
          controller.abort();
          abortControllerRef.current = null;
        })
      : undefined;

    fetchEventSource(url, {
      ...options,
      fetch: (input: RequestInfo | URL, opts: RequestInit | undefined) =>
        fetch(input, { ...opts, reactNative: { textStreaming: true } }),
      signal: controller.signal,
    }).catch(err => {
      console.error("FETCH EVENT SOURCE ERROR", err);
    });

    return () => {
      controller.abort();
      abortControllerRef.current = null;
    };
  }, [url, createOptions]);

  return () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };
};
