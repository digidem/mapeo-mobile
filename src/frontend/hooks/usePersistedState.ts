import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import debug from "debug";

const log = debug("mapeo:DraftObservationContext");

type Status = "idle" | "loading";

type Opts = {
  stringify?: (value: any) => string;
  parse?: (value: string) => any;
};

export default function createPersistedState(
  key: string,
  { stringify = JSON.stringify, parse = JSON.parse }: Opts = {}
) {
  if (typeof key !== "string") throw new Error("Key must be a string");

  return function usePersistedState<S>(initialValue: S) {
    const [state, setState] = useState<S>(initialValue);
    const [cachedInitialValue] = useState<S>(initialValue);
    const [status, setStatus] = useState<Status>("loading");

    // When the app first mounts, load draft from storage
    useEffect(() => {
      let didCancel = false;
      AsyncStorage.getItem(key)
        .then(json => {
          if (didCancel) return;
          const value = json === null ? cachedInitialValue : parse(json);
          setState(value);
          setStatus("idle");
        })
        .catch(e => {
          log("Error reading value from storage", e);
          // We ignore errors loading a value, and just treat it as the value was not saved
          setStatus("idle");
        });
      return () => {
        didCancel = true;
      };
    }, [cachedInitialValue]);

    // Save draft to local storage on every update
    // TODO: Debounce this for perf when updates are fast
    // We ignore saving state - no need to render anything for that
    useEffect(() => {
      AsyncStorage.setItem(key, stringify(state)).catch(e => {
        log("Error writing to storage", e);
      });
    });

    return [state, status, setState] as const;
  };
}
