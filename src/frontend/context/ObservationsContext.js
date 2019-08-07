// @flow
import * as React from "react";

import type { LocationContextType } from "./LocationContext";
import type { UseState } from "../types";

export type ObservationAttachment = {
  id: string,
  type?: string
};

export type ObservationValue = {
  lat?: number | null,
  lon?: number | null,
  metadata?: {
    location?: LocationContextType | void,
    manualLocation?: boolean
  },
  refs?: Array<{ id: string }>,
  attachments?: Array<ObservationAttachment>,
  tags: { [string]: any }
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
  value: ObservationValue
};

export type ObservationsMap = Map<string, Observation>;

type ObservationsContextValue = {
  // A map of all observations in memory, by id
  observations: ObservationsMap,
  // True whilst loading from Mapeo Core
  loading: boolean,
  // If there is an error loading or saving an observation this will contain the
  // error object
  error: Error | null
};

export type ObservationsContextType = UseState<ObservationsContextValue>;

const defaultContext = [
  {
    observations: new Map(),
    loading: false,
    error: null
  },
  () => {}
];

const ObservationsContext = React.createContext<ObservationsContextType>(
  defaultContext
);

type Props = {
  children: React.Node
};

export const ObservationsProvider = ({ children }: Props) => {
  const [state, setState] = React.useState(defaultContext[0]);
  const contextValue = React.useMemo(() => [state, setState], [state]);
  return (
    <ObservationsContext.Provider value={contextValue}>
      {children}
    </ObservationsContext.Provider>
  );
};

export default ObservationsContext;
