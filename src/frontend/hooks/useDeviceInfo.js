// @flow
import React from "react";
import DeviceInfo from "react-native-device-info";
import isPromise from "p-is-promise";
import debug from "debug";

type State = "loading" | "ready" | "error";

const log = debug("mapeo:useDeviceInfo");

export default function useDeviceInfo(prop: string) {
  const methodName = "get" + prop.replace(/^[a-z]/, m => m.toUpperCase());
  const result = React.useMemo(() => DeviceInfo[methodName](), [methodName]);
  const resultIsPromise = isPromise(result);

  const [value, setValue] = React.useState(resultIsPromise ? null : result);
  const [state, setState] = React.useState<State>(
    resultIsPromise ? "loading" : "ready"
  );
  const [context, setContext] = React.useState();

  React.useEffect(() => {
    if (typeof result !== "object") return;
    result
      .then(v => {
        setState("ready");
        setValue(v);
      })
      .catch(e => {
        log(`Error reading DeviceInfo.${methodName}(): ${e.message}`);
        setState("error");
        setContext(e);
        setValue(undefined);
      });
  }, [result, methodName]);

  return React.useMemo(() => ({ value, state, context }), [
    value,
    state,
    context,
  ]);
}
