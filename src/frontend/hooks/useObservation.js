// @flow
import { useContext, useState, useEffect } from "react";

import api from "../api";
import { matchPreset, addFieldDefinitions } from "../lib/utils";
import ObservationsContext, {
  type Observation
} from "../context/ObservationsContext";
import PresetsContext, {
  type PresetWithFields
} from "../context/PresetsContext";
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
    PresetsContext
  );
  const [deletingStatus, setDeletingStatus] = useState();
  const [deleteRequest, setDeleteRequest] = useState();
  const loadingStatus = mergeLoadingStatus(observationsStatus, presetsStatus);

  const observation =
    typeof observationId === "string"
      ? observations.get(observationId)
      : undefined;
  const preset = observation && matchPreset(observation.value, presets);

  useEffect(() => {
    let didCancel = false;
    // Can't delete it if we can't find it
    if (!observation) return;
    setDeleteRequest("loading");
    api
      .deleteObservation(observation.id)
      .then(() => {
        dispatch({ type: "delete", value: observation });
        if (didCancel) return;
        setDeletingStatus("success");
      })
      .catch(e => {
        if (didCancel) return;
        setDeletingStatus("error");
      });
    return () => {
      didCancel = true;
    };
  }, [deleteRequest, observation, dispatch]);

  return [
    {
      deletingStatus,
      loadingStatus,
      observation: observation,
      preset: preset && addFieldDefinitions(preset, fields)
    },
    () => setDeleteRequest({})
  ];
};

function mergeLoadingStatus(...statuses: Array<Status>): Status {
  if (statuses.includes("error")) return "error";
  else if (statuses.every(status => status === "success")) return "success";
  else return "loading";
}
