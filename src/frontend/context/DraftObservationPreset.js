// @flow
import * as React from "react";
import DraftObservationContext from "../context/DraftObservationContext";
import PresetsContext from "../context/PresetsContext";
import type { ObservationValue } from "../context/ObservationsContext";
import type { PresetWithFields } from "../context/PresetsContext";

type Props = {
  // id of observation to return
  id?: any,
  children: ({
    observationValue?: ObservationValue,
    preset?: PresetWithFields
  }) => React.Node
};

/**
 * This is a convenience wrapper for the DraftObservation and Preset contexts.
 * It will call the child function with the current value of the draft
 * observation along with the matching preset.
 */
const ObservationPreset = ({ id, children }: Props) => (
  <DraftObservationContext.Consumer>
    {({ value }) => (
      <PresetsContext.Consumer>
        {({ getPreset }) => {
          const preset = getPreset(value);
          return children({ observationValue: value, preset });
        }}
      </PresetsContext.Consumer>
    )}
  </DraftObservationContext.Consumer>
);

export default ObservationPreset;
