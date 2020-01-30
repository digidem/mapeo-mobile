// @flow
import { useContext, useState, useCallback } from "react";

import api from "../api";
import { matchPreset, addFieldDefinitions } from "../lib/utils";
import ObservationsContext, {
  type Observation
} from "../context/ObservationsContext";
import ConfigContext, { type PresetWithFields } from "../context/ConfigContext";
import type { Status } from "../types";

type UseObservation = [
  {
    observation?: Observation,
    preset?: PresetWithFields,
    loadingStatus: Status,
    deletingStatus?: Status
  },
  // Delete the observation
  () => void
];

export default (observationId: mixed): UseObservation => {
  const [{ observations, status: observationsStatus }, dispatch] = useContext(
    ObservationsContext
  );
  const [{ presets, fields, status: presetsStatus }] = useContext(
    ConfigContext
  );
  const [deletingStatus, setDeletingStatus] = useState();
  const loadingStatus = mergeLoadingStatus(observationsStatus, presetsStatus);

  const observation =
    typeof observationId === "string"
      ? observations.get(observationId)
      : undefined;
  const preset = observation && matchPreset(observation.value, presets);

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
      preset: preset && addFieldDefinitions(preset, fields)
    },
    deleteObservation
  ];
};

function mergeLoadingStatus(...statuses: Array<Status>): Status {
  if (statuses.includes("error")) return "error";
  else if (statuses.every(status => status === "success")) return "success";
  else return "loading";
}
