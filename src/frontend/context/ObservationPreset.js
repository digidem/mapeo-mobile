// @flow
import * as React from "react";
import ObservationsContext from "../context/ObservationsContext";
import PresetsContext from "../context/PresetsContext";
import type { Observation } from "../context/ObservationsContext";
import type { PresetWithFields } from "../context/PresetsContext";

type Props = {
  id?: any,
  children: ({
    observation?: Observation,
    preset?: PresetWithFields
  }) => React.Node
};

/**
 * Pass an id prop and look up an observation with that id and look up the best
 * matching preset. Pass a function as a child component, which will be called
 * with ({ observation, preset }) if any match is found.
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
