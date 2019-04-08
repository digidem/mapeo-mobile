// @flow
import * as React from "react";
import debug from "debug";

import { getPresets } from "../api";
import type { Observation } from "./ObservationsContext";

const log = debug("mapeo:PresetsContext");

type PresetBase<T> = {|
  icon?: string,
  fields?: T[],
  geometry: Array<"point" | "area" | "line" | "vertex" | "relation">,
  terms?: string[],
  tags: { [string]: any },
  name: string,
  sort?: number,
  matchScore?: number,
  searchable?: boolean
|};

export type Field = {|
  key: string,
  type: "text" | "textarea" | "number" | "localized" | "check" | "combo",
  label: string,
  placeholder?: string,
  options?: string[],
  universal?: boolean
|};

export type Preset = PresetBase<string>;
export type PresetWithFields = PresetBase<Field>;

type PresetsContext = {
  presets: { [string]: Preset },
  fields: { [string]: Field },
  getPreset: (observation: Observation) => ?PresetWithFields,
  loading: boolean,
  error?: boolean
};

const defaultContext = {
  presets: {},
  fields: {},
  getPreset: () => {},
  loading: false
};

const {
  Provider,
  Consumer: PresetsConsumer
} = React.createContext<PresetsContext>(defaultContext);

type Props = {
  children: React.Node
};

class PresetsProvider extends React.Component<Props, PresetsContext> {
  state = {
    presets: {},
    fields: {},
    getPreset: this.getPreset.bind(this),
    loading: true
  };

  componentDidMount() {
    getPresets((err, data) => {
      if (err) {
        log("Error loading presets\n", err);
        this.setState({ error: true, loading: false });
        return;
      }
      log(
        `Loaded ${Object.keys(data.presets).length} presets and ${
          Object.keys(data.fields).length
        } fields`
      );
      this.setState({
        presets: data.presets,
        fields: data.fields,
        loading: false
      });
    });
  }

  getPreset(observation: Observation): ?PresetWithFields {
    const categoryId = observation.value.tags.categoryId;
    if (!categoryId) return;
    const { presets, fields } = this.state;
    const preset = presets[categoryId];
    if (!preset) return;
    const presetWithFields = Object.assign({}, preset, {
      fields: getFieldDefinitions(preset, fields)
    });
    return presetWithFields;
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

export default {
  Provider: PresetsProvider,
  Consumer: PresetsConsumer
};

function getFieldDefinitions(
  preset: Preset,
  fields: $ElementType<PresetsContext, "fields">
): PresetWithFields {
  return (preset.fields || []).map(fieldId => fields[fieldId]).filter(Boolean);
}
