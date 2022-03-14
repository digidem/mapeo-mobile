import { useContext, useState, useCallback } from "react";
import { Observation } from "mapeo-schema";

import api from "../api";
import { matchPreset, addFieldDefinitions } from "../lib/utils";
import ConfigContext, { PresetWithFields } from "../context/ConfigContext";
import ObservationsContext from "../context/ObservationsContext";
import { Status } from "../sharedTypes";

type UseObservation = [
  {
    observation?: Observation;
    preset?: PresetWithFields;
    loadingStatus: Status;
    deletingStatus?: Status;
  },
  // Delete the observation
  () => void
];

export const useObservation = (observationId: unknown): UseObservation => {
  const [{ observations, status: observationsStatus }, dispatch] = useContext(
    ObservationsContext
  );
  const [{ presets, fields, status: presetsStatus }] = useContext(
    ConfigContext
  );
  const [deletingStatus, setDeletingStatus] = useState<Status>();
  const loadingStatus = mergeLoadingStatus(observationsStatus, presetsStatus);

  const observation =
    typeof observationId === "string"
      ? observations.get(observationId)
      : undefined;
  const preset = observation && matchPreset(observation, presets);

  const deleteObservation = useCallback(() => {
    // Can't delete it if we can't find it
    if (!observation) return;
    setDeletingStatus("loading");
    api
      .deleteObservation(observation.id)
      .then(() => {
        dispatch({ type: "delete", value: observation });
        setDeletingStatus("success");
      })
      .catch(e => {
        setDeletingStatus("error");
      });
  }, [dispatch, observation]);

  return [
    {
      deletingStatus,
      loadingStatus,
      observation: observation,
      preset: preset ? addFieldDefinitions(preset, fields) : undefined,
    },
    deleteObservation,
  ];
};

function mergeLoadingStatus(...statuses: Array<Status>): Status {
  if (statuses.includes("error")) return "error";
  else if (statuses.every(status => status === "success")) return "success";
  else return "loading";
}
