// @flow
import * as React from "react";

import api from "../../__mocks__/api";
import type { LocationContextType } from "../LocationContext";
import type { Status } from "../../types";

export type ObservationAttachment = {
  id: string,
  type?: string,
};

export type ObservationValue = {
  lat?: number | null,
  lon?: number | null,
  deviceId?: string,
  metadata?: {
    location?: LocationContextType | void,
    manualLocation?: boolean,
  },
  refs?: Array<{ id: string }>,
  attachments?: Array<ObservationAttachment>,
  tags: { [string]: any },
};

export type Observation = {
  id: string,
  version: string,
  created_at: string,
  timestamp?: string,
  userId?: string,
  type: "observation",
  links?: string[],
  schemaVersion: 4,
  value: ObservationValue,
};

export type ObservationsMap = Map<string, Observation>;

type State = {
  // A map of all observations in memory, by id
  observations: ObservationsMap,
  // Status intial load / reload of observations from the server
  status: Status,
  // Set to a new object in order to force a reload
  reload?: {},
};

type Action =
  | {| type: "create" | "update" | "delete", value: Observation |}
  | {| type: "reload" |}
  | {| type: "reload_error", value: Error |}
  | {| type: "reload_success", value: Observation[] |};

export type ObservationsContextType = [State, (action: Action) => void];

const defaultContext = [
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
      cloned.set(action.value.id, action.value);
      return { ...state, observations: cloned };
    }
    case "delete": {
      const cloned = new Map(state.observations);
      cloned.delete(action.value.id);
      return { ...state, observations: cloned };
    }
    case "reload":
      return { ...state, reload: {}, status: "loading" };
    case "reload_error":
      return { ...state, status: "error" };
    case "reload_success":
      return {
        ...state,
        observations: new Map(action.value.map(obs => [obs.id, obs])),
        status: "success",
      };
    default:
      return state;
  }
}

export const ObservationsProvider = ({
  children,
}: {
  children: React.Node,
}) => {
  const [state, dispatch] = React.useReducer(reducer, defaultContext[0]);
  const contextValue = React.useMemo(() => [state, dispatch], [state]);

  // This will load observations on first load and reload them every time the
  // value of state.reload changes (dispatch({type: "reload"}) will do this)
  React.useEffect(() => {
    let didCancel = false;
    api
      .getObservations()
      .then(obsList => {
        if (didCancel) return;
        dispatch({ type: "reload_success", value: obsList });
      })
      .catch(e => {
        if (didCancel) return;
        dispatch({ type: "reload_error", value: e });
      });
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
