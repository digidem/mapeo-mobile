import { useEffect, useState } from "react";
import {
  fetchEventSource,
  EventStreamContentType,
} from "@microsoft/fetch-event-source";
// TODO: Ideally create module defs for this
// @ts-ignore
import { fetch } from "react-native-fetch-api";

class RetriableError extends Error {}
class FatalError extends Error {}

export function useEventSource<T extends any>(
  // TODO: Should fix this at the app level, where the maps api is only available if the port is known
  url: string | undefined
) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    fetchEventSource(url, {
      async onopen(response) {
        if (
          response.ok &&
          response.headers.get("content-type") === EventStreamContentType
        ) {
          return; // everything's good
        } else if (
          response.status >= 400 &&
          response.status < 500 &&
          response.status !== 429
        ) {
          // client-side errors are usually non-retriable:
          throw new FatalError();
        } else {
          throw new RetriableError();
        }
      },
      onmessage(ev) {
        try {
          const data = JSON.parse(ev.data);
          setData(data);
        } catch (e) {
          // TODO: use Error Cause API
          throw new FatalError((e as Error).message);
        }
      },
      onerror(err) {
        if (err instanceof FatalError) {
          setError(err);
          throw err;
        }
      },
      fetch: (input: RequestInfo | URL, opts: RequestInit | undefined) =>
        fetch(input, { ...opts, reactNative: { textStreaming: true } }),
      signal: controller.signal,
    }).catch(err => {
      console.error("FETCH EVENT SOURCE ERROR", err);
    });

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, error };
}
