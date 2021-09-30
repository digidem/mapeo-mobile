import * as React from "react";

import api from "../api";
import type { LocationContextType } from "./LocationContext";
import type { Status } from "../types";
import { Position } from "mapeo-schema";

export interface ObservationAttachment {
  id: string;
  type?: string;
}

export interface ObservationValue {
  lat?: number | null;
  lon?: number | null;
  deviceId?: string;
  metadata?: {
    location?: LocationContextType | void;
    manualLocation?: boolean;
  };
  refs?: Array<{ id: string }>;
  attachments?: Array<ObservationAttachment>;
  tags: { [key: string]: any };
}

export interface Observation {
  id: string;
  version: string;
  created_at: string;
  timestamp?: string;
  userId?: string;
  type: "observation";
  links?: string[];
  schemaVersion: 4;
  value: ObservationValue;
  metadata?: {
    lastSavedPosition?: Position;
    manualLocation?: boolean;
    position?: Position;
    positionProvider?: {
      gpsAvailable?: boolean;
      locationServicesEnabled?: boolean;
      networkAvailable?: boolean;
      passiveAvailable?: boolean;
    };
  };
}

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

const ObservationsContext: React.Context<ObservationsContextType> = React.createContext<ObservationsContextType>(
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
}: React.PropsWithChildren<{}>) => {
  const [state, dispatch] = React.useReducer(reducer, defaultContext[0]);
  const contextValue = React.useMemo(() => [state, dispatch] as const, [state]);

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
