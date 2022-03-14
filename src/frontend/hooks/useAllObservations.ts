import { useCallback, useContext, useMemo } from "react";
import { Observation } from "mapeo-schema";

import ObservationsContext from "../context/ObservationsContext";
import { Status } from "../sharedTypes";

export const useAllObservations = (): [
  {
    // Array of observations
    observations: Observation[];
    status: Status;
  },
  // reload observations from Mapeo Core
  () => void
] => {
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
      status: state.status,
    },
    reload,
  ];
};
