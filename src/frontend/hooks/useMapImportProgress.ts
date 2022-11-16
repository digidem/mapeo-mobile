import { useEffect, useState, useContext } from "react";
import {
  fetchEventSource,
  EventStreamContentType,
} from "@microsoft/fetch-event-source";
// TODO: Ideally create module defs for this
// @ts-expect-error
import { fetch } from "react-native-fetch-api";
import {
  MapImportsStateContext,
  MapImportsActionsContext,
} from "../context/MapImportsContext";
import api from "../api";

// TODO: Export from map-server
type MessageProgress = {
  type: "progress";
  importId: string;
  soFar: number;
  total: number;
};

type MessageComplete = {
  type: "complete";
  importId: string;
  soFar: number;
  total: number;
};

type MessageError = {
  type: "error";
  importId: string;
  soFar: number;
  total: number;
};

type ImportProgressMessage = MessageProgress | MessageComplete | MessageError;

export type MapImportState =
  | { status: "idle" | "error" }
  | { status: "progress" | "complete"; progress: number }
  | undefined;

class RetriableError extends Error {}
class FatalError extends Error {}

export function useMapImportProgress(styleId: string): MapImportState {
  const [state, setState] = useState<MapImportState>({ status: "idle" });
  const activeImports = useContext(MapImportsStateContext);
  const dispatch = useContext(MapImportsActionsContext);
  const importId = activeImports[styleId];

  useEffect(() => {
    if (!importId) {
      // If we are not tracking an import for this style, remove it from our map imports state
      dispatch({ type: "remove", styleId: styleId });
      return;
    }

    const controller = new AbortController();

    (async () => {
      try {
        const url = await api.maps.getImportProgressUrl(importId);
        if (controller.signal.aborted) return;

        await fetchEventSource(url, {
          onopen: validateResponse,
          onmessage(ev) {
            try {
              const msg = JSON.parse(ev.data) as ImportProgressMessage;
              setState(progressMsgToState(msg));
              if (msg.type === "complete") {
                // If import is complete, remove it from tracked import state
                dispatch({ type: "remove", styleId });
              }
            } catch (e) {
              throw new FatalError("Unable to parse msg " + ev.data);
            }
          },
          onerror(err) {
            if (err instanceof FatalError) throw err;
            // If not thrown, then fetch-event-source will retry
          },
          fetch: wrappedFetch,
          signal: controller.signal,
        });
      } catch (err) {
        setState(state => {
          return { status: "error" };
        });
        console.error("FETCH EVENT SOURCE ERROR", err);
      }
    })();

    return () => {
      controller.abort();
    };
  }, [importId, styleId]);

  if (!importId) return;
  return state;
}

/**
 * Wrap fetch to accommodate react-native's implementation of fetch
 */
function wrappedFetch(input: RequestInfo | URL, opts: RequestInit | undefined) {
  return fetch(input, { ...opts, reactNative: { textStreaming: true } });
}

/**
 * Validate a fetch response, throws RetriableError if retryable, otherwise
 * FatalError
 */
async function validateResponse(response: Response) {
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
    throw new FatalError();
  } else {
    throw new RetriableError();
  }
}

/**
 * Convert a progress message received via SSE to import progress state
 */
function progressMsgToState(msg: ImportProgressMessage): MapImportState {
  return {
    status: msg.type,
    progress: msg.soFar / msg.total,
  };
}
