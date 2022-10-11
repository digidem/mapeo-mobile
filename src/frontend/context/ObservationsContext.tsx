import * as React from "react";
import { Observation } from "mapeo-schema";

import api from "../api";
import { Status } from "../sharedTypes";
import { SecurityContext } from "./SecurityContext";

export interface ObservationAttachment {
  id: string;
  type?: string;
}

export interface ClientGeneratedObservation
  extends Omit<
    Observation,
    "created_at" | "schemaVersion" | "id" | "type" | "version"
  > {}

export type ObservationsMap = Map<string, Observation>;

type State = {
  // A map of all observations in memory, by id
  observations: ObservationsMap;
  // Status intial load / reload of observations from the server
  status: Status;
  // Set to a new object in order to force a reload
  reload?: {};
};

type Action =
  | { type: "create" | "update" | "delete"; value: Observation }
  | { type: "reload" }
  | { type: "reload_error"; value: Error }
  | { type: "reload_success"; value: Observation[] };

export type ObservationsContextType = readonly [
  State,
  (action: Action) => void
];

const defaultContext: ObservationsContextType = [
  {
    observations: new Map(),
    status: "loading",
  },
  () => {},
];

const ObservationsContext = React.createContext<ObservationsContextType>(
  defaultContext
);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "update":
    case "create": {
      const cloned = new Map(state.observations);
      const { value } = action;
      cloned.set(value.id, value);
      return { ...state, observations: cloned };
    }
    case "delete": {
      const cloned = new Map(state.observations);
      const { value } = action;
      cloned.delete(value.id);
      return { ...state, observations: cloned };
    }
    case "reload":
      return { ...state, reload: {}, status: "loading" };
    case "reload_error":
      return { ...state, status: "error" };
    case "reload_success":
      const { value } = action;
      return {
        ...state,
        observations: new Map(value.map(obs => [obs.id, obs])),
        status: "success",
      };
    default:
      return state;
  }
}

export const ObservationsProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = React.useReducer(reducer, defaultContext[0]);

  const { obscureModeOn } = React.useContext(SecurityContext);

  const contextValue: ObservationsContextType = React.useMemo(() => {
    const derivedState = { ...state };
    if (obscureModeOn) derivedState.observations = new Map([]);
    return [derivedState, dispatch];
  }, [state, obscureModeOn]);

  // This will load observations on first load and reload them every time the
  // value of state.reload changes (dispatch({type: "reload"}) will do this)
  React.useEffect(() => {
    let didCancel = false;

    const fetchObservations = async () => {
      try {
        const obsList = await api.getObservations();
        if (didCancel) return;
        dispatch({ type: "reload_success", value: obsList });
      } catch (err) {
        if (didCancel || !(err instanceof Error)) return;
        dispatch({ type: "reload_error", value: err });
      }
    };

    fetchObservations();

    return () => {
      didCancel = true;
    };
  }, [state.reload]);

  return (
    <ObservationsContext.Provider value={contextValue}>
      {children}
    </ObservationsContext.Provider>
  );
};

export default ObservationsContext;
