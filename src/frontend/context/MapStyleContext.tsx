import * as React from "react";
import createPersistedState from "../hooks/usePersistedState";

/** Key used to store most recent map id in Async Storage */
const MAP_STYLE_KEY = "@MAPSTYLE";

export type MapTypes =
  | "loading"
  | "mapServer"
  | "custom"
  | "online"
  | "fallback";

type MapStyleContextType = readonly [
  string | null,
  React.Dispatch<React.SetStateAction<string | null>>
];

const defaultMapStyleContext: MapStyleContextType = [null, () => {}];

export const MapStyleContext: React.Context<MapStyleContextType> = React.createContext<
  MapStyleContextType
>(defaultMapStyleContext);

const usePersistedState = createPersistedState(MAP_STYLE_KEY);

export const MapStyleProvider: React.FC = ({ children }) => {
  const [styleId, , setStyleId] = usePersistedState<string | null>(null);

  const contextValue = React.useMemo(() => [styleId, setStyleId] as const, [
    styleId,
    setStyleId,
  ]);

  return (
    <MapStyleContext.Provider value={contextValue}>
      {children}
    </MapStyleContext.Provider>
  );
};
