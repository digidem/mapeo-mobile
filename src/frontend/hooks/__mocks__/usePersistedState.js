// @flow
import React from "react";

type Status = "idle" | "loading";
type Opts = {
  stringify: any => string,
  parse: string => any,
};

export default function createPersistedState(
  key: string,
  { stringify = JSON.stringify, parse = JSON.parse }: Opts = {}
) {
  return function usePersistedState<S>(
    initialValue: S
  ): [S, Status, ((S => S) | S) => void] {
    const [state, setState] = React.useState<S>(initialValue);
    return [state, "idle", setState];
  };
}
