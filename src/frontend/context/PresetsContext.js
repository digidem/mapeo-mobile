// @flow
import * as React from "react";
import debug from "debug";

import { getPresets, getFields } from "../api";
import type { Observation } from "./ObservationsContext";

const log = debug("mapeo:PresetsContext");

export type Preset = {|
  id: string,
  icon?: string,
  fields?: string[],
  geometry: Array<"point" | "area" | "line" | "vertex" | "relation">,
  terms?: string[],
  tags: { [string]: any },
  name: string,
  sort?: number,
  matchScore?: number,
  searchable?: boolean
|};

export type Field = {|
  id: string,
  key: string,
  type: "text" | "textarea" | "number" | "localized" | "check" | "combo",
  label: string,
  placeholder?: string,
  options?: string[],
  universal?: boolean
|};

export type PresetWithFields = {|
  id: string,
  icon?: string,
  fields: Field[],
  geometry: Array<"point" | "area" | "line" | "vertex" | "relation">,
  terms?: string[],
  tags: { [string]: any },
  name: string,
  sort?: number,
  matchScore?: number,
  searchable?: boolean
|};

export type PresetsMap = Map<string, Preset>;
export type FieldsMap = Map<string, Field>;

type PresetsContext = {
  presets: PresetsMap,
  fields: FieldsMap,
  getPreset: (observation: Observation) => PresetWithFields | void,
  loading: boolean,
  error?: boolean
};

const defaultContext = {
  presets: new Map(),
  fields: new Map(),
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
    presets: new Map(),
    fields: new Map(),
    getPreset: this.getPreset.bind(this),
    loading: true
  };

  componentDidMount() {
    getPresets((err, presetsList) => {
      if (err) {
        log("Error loading presets\n", err);
        this.setState({ error: true, loading: false });
        return;
      }
      log(`Loaded ${presetsList.length} presets`);
      this.setState({
        presets: new Map(presetsList.map(p => [p.id, p])),
        loading: false
      });
    });
    getFields((err, fieldsList) => {
      if (err) {
        log("Error loading fields\n", err);
        this.setState({ error: true, loading: false });
        return;
      }
      log(`Loaded ${fieldsList.length} fields`);
      this.setState({
        fields: new Map(fieldsList.map(p => [p.id, p])),
        loading: false
      });
    });
  }

  addFieldDefinitions(preset: Preset): PresetWithFields {
    const { fields } = this.state;
    const fieldDefs = Array.isArray(preset.fields)
      ? preset.fields.map(fieldId => fields.get(fieldId))
      : [];
    // $FlowFixMe - Need to figure out how to convert types like this
    return {
      ...preset,
      fields: filterFalsy(fieldDefs)
    };
  }

  getPreset(observation: Observation): PresetWithFields | void {
    const categoryId = observation.value.tags.categoryId;
    if (!categoryId) return;
    const { presets } = this.state;
    const preset = presets.get(categoryId);
    if (!preset) return;
    return this.addFieldDefinitions(preset);
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

export default {
  Provider: PresetsProvider,
  Consumer: PresetsConsumer
};

// This is a helper function to force the type definition
// It filters an array to remove any falsy values
function filterFalsy<T>(arr: Array<T | void>): Array<T> {
  return arr.filter(Boolean);
}
