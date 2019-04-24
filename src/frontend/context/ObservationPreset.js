// @flow
import * as React from "react";
import ObservationsContext from "../context/ObservationsContext";
import PresetsContext from "../context/PresetsContext";
import type { Observation } from "../context/ObservationsContext";
import type { PresetWithFields } from "../context/PresetsContext";

type Props = {
  // id of observation to return
  id?: any,
  children: ({
    observation?: Observation,
    preset?: PresetWithFields
  }) => React.Node
};

/**
 * This is a convenience wrapper for the Observation and Preset contexts.
 * For a given `id` this will call a child function with a matching observation
 * and matching preset.
 */
const ObservationPreset = ({ id, children }: Props) => (
  <ObservationsContext.Consumer>
    {({ observations }) => (
      <PresetsContext.Consumer>
        {({ getPreset }) => {
          const observation = typeof id === "string" && observations.get(id);
          if (!observation) return children({});
          const preset = getPreset(observation.value);
          return children({ observation, preset });
        }}
      </PresetsContext.Consumer>
    )}
  </ObservationsContext.Consumer>
);

export default ObservationPreset;
