import React from "react";

type Status = "idle" | "loading";

type Opts = {
  stringify?: (value: any) => string;
  parse?: (value: string) => any;
};

export default function createPersistedState(
  key: string,
  { stringify = JSON.stringify, parse = JSON.parse }: Opts = {}
) {
  return function usePersistedState<S>(
    initialValue: S
  ): readonly [S, Status, React.Dispatch<React.SetStateAction<S>>] {
    const [state, setState] = React.useState<S>(initialValue);
    return [state, "idle", setState] as const;
  };
}
