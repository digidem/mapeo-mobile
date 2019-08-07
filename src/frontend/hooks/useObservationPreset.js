// @flow
import { useContext } from "react";
import { matchPreset, addFieldDefinitions } from "../lib/utils";
import ObservationsContext, {
  type ObservationValue
} from "../context/ObservationsContext";
import PresetsContext, {
  type PresetWithFields
} from "../context/PresetsContext";

type UseObservationPreset = {
  observation?: ObservationValue,
  preset?: PresetWithFields,
  loading: boolean,
  error: boolean
};

export default (observationId: string): UseObservationPreset => {
  const [
    { observations, loading: observationsLoading, error: observationsError }
  ] = useContext(ObservationsContext);
  const [
    { presets, fields, loading: presetsLoading, error: presetsError }
  ] = useContext(PresetsContext);

  const loading = observationsLoading || presetsLoading;
  const error = !!observationsError || !!presetsError;

  const observation =
    typeof observationId === "string" && observations.get(observationId);
  if (!observation) return { loading, error };

  const preset = matchPreset(observation.value, presets);
  if (!preset) return { loading, error, observation: observation.value };

  return {
    loading,
    error,
    observation: observation.value,
    preset: addFieldDefinitions(preset, fields)
  };
};
