// @flow
import * as React from "react";
import debug from "debug";

import api from "../api";
import bugsnag from "../lib/logger";
import type { Status } from "../types";

const log = debug("mapeo:ConfigContext");

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
  type: "select_one" | "select_multiple",
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

export type Metadata = {
  projectKey?: string,
  name?: string,
  dataset_id?: string,
  version?: string
};

export type State = {
  // A map of presets by preset id
  presets: PresetsMap,
  // A map of field definitions by id
  fields: FieldsMap,
  metadata: Metadata,
  status: Status
};

export type ConfigContextType = [
  State,
  { reload: () => any, replace: (fileUri: string) => any }
];

const defaultConfig = {
  presets: new Map(),
  fields: new Map(),
  metadata: {}
};

const defaultContext: ConfigContextType = [
  {
    ...defaultConfig,
    status: "idle"
  },
  {
    reload: () => {},
    replace: () => {}
  }
];

const ConfigContext = React.createContext<ConfigContextType>(defaultContext);

type Props = {
  children: React.Node
};

export const ConfigProvider = ({ children }: Props) => {
  const [config, setConfig] = React.useState(defaultConfig);
  const [status, setStatus] = React.useState<Status>("idle");
  const [reloadToken, setReloadToken] = React.useState();

  const reload = React.useCallback(() => setReloadToken({}), []);

  const replace = React.useCallback(
    fileUri => {
      setStatus("loading");
      api
        .replaceConfig(fileUri)
        .then(reload)
        .catch(err => {
          log("Error replacing presets", err);
          setStatus("error");
        });
    },
    [reload]
  );

  const contextValue = React.useMemo(
    () => [
      { ...config, status },
      { reload, replace }
    ],
    [config, status, reload, replace]
  );

  // Load presets and fields from Mapeo Core on first mount of the app
  React.useEffect(() => {
    let didCancel = false;
    setStatus("loading");
    Promise.all([api.getPresets(), api.getFields(), api.getMetadata()])
      .then(([presetsList, fieldsList, metadata]) => {
        if (didCancel) return; // if component was unmounted, don't set state
        setConfig({
          presets: new Map(
            presetsList.filter(filterPointPreset).map(p => [p.id, p])
          ),
          fields: new Map(fieldsList.map(p => [p.id, p])),
          metadata: metadata
        });
        setStatus("success");
      })
      .catch(err => {
        bugsnag.notify(err, report => (report.severity = "error"));
        log("Error loading presets and fields", err);
        if (didCancel) return; // if component was unmounted, don't set state
        setStatus("error");
      });
    return () => {
      didCancel = true;
    };
  }, [reloadToken]);

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContext;

// We only want to show presets that apply to geometry type "point"
function filterPointPreset(preset: Preset) {
  return preset.geometry && preset.geometry.includes("point");
}
