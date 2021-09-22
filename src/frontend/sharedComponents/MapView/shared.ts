import { ObservationsMap } from "../../context/ObservationsContext";
import { MapStyleType } from "../../hooks/useMapStyle";

export type Coordinates = [number, number];

export interface SharedMapProps {
  observations: ObservationsMap;
  styleURL?: string;
  styleType: MapStyleType;
  onPressObservation: (observationId: string) => void;
}

// Min distance in meters the user moves before the map will re-render (saves
// lots of map renders when the user is standing still, which uses up battery
// life)
export const MIN_DISPLACEMENT = 15;
