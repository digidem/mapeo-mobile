// @flow
import React from "react";
import { useIntl, defineMessages } from "react-intl";
import type { Preset, PresetWithFields } from "../context/ConfigContext";

const m = defineMessages({
  observation: {
    // Keep id stable for translations
    id: "screens.Observation.ObservationView.observation",
    defaultMessage: "Observation",
    description: "Default name of observation with no matching preset",
  },
});

type Props = {|
  preset: Preset | PresetWithFields | void,
|};

const FormattedPresetName = ({ preset }: Props) => {
  const { formatMessage: t } = useIntl();
  const name = preset
    ? t({ id: `presets.${preset.id}.name`, defaultMessage: preset.name })
    : t(m.observation);

  return <>{name}</>;
};

export default FormattedPresetName;
