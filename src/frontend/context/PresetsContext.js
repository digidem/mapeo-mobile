// @flow strict
import * as React from "react";
import debug from "debug";
import memoize from "memoize-one";

import { getPresets, getFields } from "../api";
import { matchPreset } from "../lib/utils";
import type { ObservationValue } from "./ObservationsContext";

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

type BaseField = {|
  id: string,
  key: string,
  label: string,
  placeholder?: string,
  universal?: boolean
|};

export type TextField = {|
  ...$Exact<BaseField>,
  type: "text"
|};

export type SelectField = {|
  ...$Exact<BaseField>,
  type: "select_one",
  options: Array<string | number | {| value: number | string, label: string |}>
|};

export type Field = TextField | SelectField;

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

export type PresetsContext = {
  // A map of presets by preset id
  presets: PresetsMap,
  // A map of all defined fields by field id
  fields: FieldsMap,
  // Look up the best matching preset for the given observation value. Returns
  // the preset with fields expanded from ids to field objects
  getPreset: (observation: ObservationValue) => PresetWithFields | void,
  // True if the presets are currently loading from Mapeo Core
  loading: boolean,
  // True if there is an error loading presets from Mapeo Core
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

/**
 * The PresetsProvider is responsible for loading the preset and field
 * definitions from Mapeo Core and provides a method for matching a preset to a
 * given observation.
 */
class PresetsProvider extends React.Component<Props, PresetsContext> {
  state = {
    presets: new Map(),
    fields: new Map(),
    getPreset: this.getPreset.bind(this),
    loading: true
  };
  addFieldDefinitions = memoize(this.addFieldDefinitions);

  async componentDidMount() {
    try {
      const [presetsList, fieldsList] = await Promise.all([
        getPresets(),
        getFields()
      ]);
      this.setState({
        presets: new Map(presetsList.map(p => [p.id, p])),
        fields: new Map(fieldsList.map(p => [p.id, p])),
        loading: false
      });
    } catch (err) {
      log("Error loading presets and fields", err);
      this.setState({ error: true, loading: false });
    }
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

  getPreset(observationValue: ObservationValue): PresetWithFields | void {
    const preset = matchPreset(observationValue, this.state.presets);
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
