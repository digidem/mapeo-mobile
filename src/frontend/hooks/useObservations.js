// @flow
import { useContext } from "react";
import debug from "debug";

import ObservationsContext, {
  type ObservationsMap,
  type Observation,
  type ObservationValue
} from "../context/ObservationsContext";
import api from "../api";

const log = debug("mapeo:useObservations");

type UseObservations = {
  // A map of all observations in memory, by id
  observations: ObservationsMap,
  // Reload the observations from Mapeo Core
  reloadObservations: () => any,
  // True whilst loading from Mapeo Core
  loading: boolean,
  // Create a new observation, saving it to the server
  createObservation: (value: ObservationValue) => Promise<Observation>,
  // Delete an observation
  deleteObservation: (id: string) => Promise<void>,
  // Update an existing observation
  updateObservation: (
    id: string,
    value: ObservationValue
  ) => Promise<Observation>,
  // If there is an error loading or saving an observation this will contain the
  // error object
  error: Error | null
};

export default (): UseObservations => {
  const [state, setState] = useContext(ObservationsContext);

  function handleError(error: Error) {
    log(error);
    setState({ ...state, error, loading: false });
  }

  async function reloadObservations() {
    log("Reload observations");
    setState({ ...state, loading: true });
    try {
      const obsList = await api.getObservations();
      setState({
        ...state,
        observations: new Map(obsList.map(obs => [obs.id, obs])),
        loading: false,
        error: null
      });
    } catch (e) {
      handleError(e);
    }
  }

  function createObservation(value: ObservationValue) {
    return api.createObservation(value).then(newObservation => {
      setState(state => {
        const cloned = new Map(state.observations);
        log("Created new observation", newObservation);
        cloned.set(newObservation.id, newObservation);
        return { ...state, observations: cloned };
      });
    });
  }

  function deleteObservation(id: string) {
    return api.deleteObservation(id).then(() => {
      setState(state => {
        const cloned = new Map(state.observations);
        log("Deleted observation:", id);
        cloned.delete(id);
        return { ...state, observations: cloned };
      });
    });
  }

  function updateObservation(id: string, value: ObservationValue) {
    const existingObservation = state.observations.get(id);
    if (!existingObservation) {
      log("tried to update observation but can't find it in state");
      return Promise.reject(new Error("Observation not found"));
    }
    return api
      .updateObservation(id, value, {
        links: [existingObservation.version]
      })
      .then(updatedObservation => {
        setState(state => {
          const cloned = new Map(state.observations);
          log("Updated observation", updatedObservation);
          cloned.set(id, updatedObservation);
          return { ...state, observations: cloned };
        });
      });
  }

  return {
    ...state,
    reloadObservations,
    createObservation,
    deleteObservation,
    updateObservation
  };
};
