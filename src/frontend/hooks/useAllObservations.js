// @flow
import { useContext, useMemo, useCallback } from "react";

import ObservationsContext, {
  type Observation
} from "../context/ObservationsContext";
import type { Status } from "../types";
type UseAllObservations = [
  {
    // Array of observations
    observations: Observation[],
    status: Status
  },
  // reload observations from Mapeo Core
  () => void
];

export default (): UseAllObservations => {
  const [state, dispatch] = useContext(ObservationsContext);

  // We store observations in state as a Map, but the components expect an array
  const observationsArray = useMemo(
    () =>
      Array.from(state.observations.values()).sort((a, b) =>
        // TODO: move sorting into component
        a.created_at < b.created_at ? 1 : -1
      ),
    [state.observations]
  );

  const reload = useCallback(() => dispatch({ type: "reload" }), [dispatch]);

  return [
    {
      observations: observationsArray,
      status: state.status
    },
    reload
  ];
};
