// @flow
import * as React from "react";
import debug from "debug";

import { getPresets } from "../api";
import type { Observation } from "./ObservationsContext";

const log = debug("mapeo:PresetsContext");

export type Preset = {|
  icon?: string,
  fields: string[],
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

type PresetsContext = {
  presets: { [string]: Preset },
  fields: { [string]: Field },
  getPreset: (observation: Observation) => ?Preset
};

const defaultContext = {
  presets: {},
  fields: {},
  getPreset: () => {}
};

const {
  Provider,
  Consumer: PresetsConsumer
} = React.createContext<PresetsContext>(defaultContext);

type Props = {
  children: React.Node
};

type State = PresetsContext & {
  loading: boolean,
  error?: boolean
};

class PresetsProvider extends React.Component<Props, State> {
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

  getPreset(observation: Observation): ?Preset {
    const categoryId = observation.value.tags.categoryId;
    if (categoryId) return this.state.presets[categoryId];
  }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

export default {
  Provider: PresetsProvider,
  Consumer: PresetsConsumer
};
