// @flow
import * as React from "react";
import debug from "debug";
import { IntlProvider, useIntl } from "react-intl";
import type {
  TextField,
  SelectOneField,
  SelectMultipleField,
} from "mapeo-schema";
import api from "../../__mocks__/api";
import bugsnag from "../../lib/logger";
import type { Status } from "../../types";

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
  searchable?: boolean,
|};

export type {
  TextField,
  SelectOneField,
  SelectMultipleField,
} from "mapeo-schema";

export type Field = TextField | SelectOneField | SelectMultipleField;

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
  searchable?: boolean,
|};

export type PresetsMap = Map<string, Preset>;
export type FieldsMap = Map<string, Field>;

export type Metadata = {
  projectKey?: string,
  name?: string,
  dataset_id?: string,
  version?: string,
};

export type Messages = {
  [id: string]: string,
};

export type State = {
  // A map of presets by preset id
  presets: PresetsMap,
  // A map of field definitions by id
  fields: FieldsMap,
  metadata: Metadata,
  messages: Messages,
  status: Status,
};

export type ConfigContextType = [
  State,
  { reload: () => any, replace: (fileUri: string) => any }
];

const defaultConfig = {
  presets: new Map(),
  fields: new Map(),
  metadata: {},
  messages: {},
};

const defaultContext: ConfigContextType = [
  {
    ...defaultConfig,
    status: "idle",
  },
  {
    reload: () => {},
    replace: () => {},
  },
];

const ConfigContext = React.createContext<ConfigContextType>(defaultContext);

type Props = {
  children: React.Node,
};

export const ConfigProvider = ({ children }: Props) => {
  const [config, setConfig] = React.useState(defaultConfig);
  const [status, setStatus] = React.useState<Status>("idle");
  const [reloadToken, setReloadToken] = React.useState();
  const intl = useIntl();

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
      { reload, replace },
    ],
    [config, status, reload, replace]
  );

  // Load presets and fields from Mapeo Core on first mount of the app
  React.useEffect(() => {
    let didCancel = false;
    setStatus("loading");
    Promise.all([
      api.getPresets(),
      api.getFields(),
      api.getMetadata(),
      api.getConfigMessages(intl.locale),
    ])
      .then(([presetsList, fieldsList, metadata, messages]) => {
        if (didCancel) return; // if component was unmounted, don't set state
        setConfig({
          presets: new Map(
            presetsList.filter(filterPointPreset).map(p => [p.id, p])
          ),
          fields: new Map(fieldsList.map(p => [p.id, p])),
          metadata: metadata,
          messages: messages,
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
  }, [reloadToken, intl.locale]);

  const mergedMessages = React.useMemo(
    () => ({
      ...intl.messages,
      ...config.messages,
    }),
    [config.messages, intl]
  );

  return (
    <IntlProvider
      key={intl.locale}
      locale={intl.locale}
      messages={mergedMessages}
      formats={intl.formats}
      onError={intl.onError}
    >
      <ConfigContext.Provider value={contextValue}>
        {children}
      </ConfigContext.Provider>
    </IntlProvider>
  );
};

export default ConfigContext;

// We only want to show presets that apply to geometry type "point"
function filterPointPreset(preset: Preset) {
  return preset.geometry && preset.geometry.includes("point");
}
