// @flow
import * as React from "react";
import debug from "debug";

import api from "../api";
import type { UseState, Status } from "../types";

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

export type State = {
  // A map of presets by preset id
  presets: PresetsMap,
  // A map of field definitions by id
  fields: FieldsMap,
  metadata: {
    projectKey?: string
  },
  status: Status
};

export type PresetsContextType = UseState<State>;

const defaultContext = [
  {
    presets: new Map(),
    fields: new Map(),
    metadata: {},
    status: "loading"
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
    setState({ ...state, status: "loading" });
    Promise.all([api.getPresets(), api.getFields(), api.getMetadata()])
      .then(([presetsList, fieldsList, metadata]) => {
        if (didCancel) return; // if component was unmounted, don't set state
        setState({
          presets: new Map(
            presetsList.filter(filterPointPreset).map(p => [p.id, p])
          ),
          fields: new Map(fieldsList.map(p => [p.id, p])),
          metadata: metadata,
          status: "success"
        });
      })
      .catch(err => {
        log("Error loading presets and fields", err);
        if (didCancel) return; // if component was unmounted, don't set state
        setState({ ...state, status: "error" });
      });
    return () => {
      didCancel = true;
    };
    // Disabled because we only ever want this to run on first load of the app
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
