// @flow
import * as React from "react";
import debug from "debug";

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
