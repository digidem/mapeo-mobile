// @flow
import * as React from "react";
import debug from "debug";

import api from "../api";
import type { UseState } from "../types";

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

export type PresetsContextValue = {
  // A map of presets by preset id
  presets: PresetsMap,
  // A map of field definitions by id
  fields: FieldsMap,
  // True if the presets are currently loading from Mapeo Core
  loading: boolean,
  // True if there is an error loading presets from Mapeo Core
  error: Error | null
};

export type PresetsContextType = UseState<PresetsContextValue>;

const defaultContext = [
  {
    presets: new Map(),
    fields: new Map(),
    loading: false,
    error: null
  },
  () => {}
];

const PresetsContext = React.createContext<PresetsContextType>(defaultContext);

type Props = {
  children: React.Node
};

export const PresetsProvider = ({ children }: Props) => {
  const [state, setState] = React.useState(defaultContext[0]);
  const contextValue = React.useMemo(() => [state, setState], [state]);

  // Load presets and fields from Mapeo Core on first mount of the app
  React.useEffect(() => {
    let didCancel = false;
    Promise.all([api.getPresets(), api.getFields()])
      .then(([presetsList, fieldsList]) => {
        if (didCancel) return; // if component was unmounted, don't set state
        setState({
          presets: new Map(
            presetsList.filter(filterPointPreset).map(p => [p.id, p])
          ),
          fields: new Map(fieldsList.map(p => [p.id, p])),
          loading: false,
          error: null
        });
      })
      .catch(err => {
        log("Error loading presets and fields", err);
        if (didCancel) return; // if component was unmounted, don't set state
        setState({ ...state, error: err, loading: false });
      });
    return () => {
      didCancel = true;
    };
  }, []);

  return (
    <PresetsContext.Provider value={contextValue}>
      {children}
    </PresetsContext.Provider>
  );
};

export default PresetsContext;

// We only want to show presets that apply to geometry type "point"
function filterPointPreset(preset: Preset) {
  return preset.geometry && preset.geometry.includes("point");
}
