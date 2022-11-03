import { useEffect, useRef } from "react";
import { useEventSource } from "./useEventSource";

export type MapImportStatus =
  | { status: "idle" }
  | { status: "progress" | "complete"; progress: number }
  | {
      status: "error";
      error: Error;
      progress: number;
    };

export function useMapImportsProgress(url?: string): MapImportStatus {
  const progressRef = useRef<number>(0);

  const { data, error } = useEventSource<{
    type: "progress" | "complete";
    importId: string;
    soFar: number;
    total: number;
  }>(url);

  useEffect(() => {
    if (data) {
      progressRef.current = data.soFar / data.total;
    }
  }, [data]);

  // TODO: How to handle this better?
  if (!url) {
    return {
      status: "idle",
    };
  }

  if (error) {
    return {
      status: "error",
      error,
      progress: progressRef.current,
    };
  }

  return data
    ? {
        status: data.type,
        progress: progressRef.current,
      }
    : {
        status: "idle",
      };
}
