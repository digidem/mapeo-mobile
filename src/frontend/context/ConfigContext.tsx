import * as React from "react";
import debug from "debug";
import { IntlProvider, useIntl } from "react-intl";
import type {
  TextField,
  SelectOneField,
  SelectMultipleField,
} from "mapeo-schema";

import api from "../api";
import useIsMounted from "../hooks/useIsMounted";
import bugsnag from "../lib/logger";
import type { Status } from "../types";

const log = debug("mapeo:ConfigContext");

export type Preset = {
  id: string;
  icon?: string;
  fields?: string[];
  geometry: Array<"point" | "area" | "line" | "vertex" | "relation">;
  terms?: string[];
  tags: { [x: string]: any };
  name: string;
  sort?: number;
  matchScore?: number;
  searchable?: boolean;
};

export type {
  TextField,
  SelectOneField,
  SelectMultipleField, //@ts-ignore
} from "mapeo-schema";

export type Field = TextField | SelectOneField | SelectMultipleField;

export type PresetWithFields = {
  id: string;
  icon?: string;
  fields: Field[];
  geometry: Array<"point" | "area" | "line" | "vertex" | "relation">;
  terms?: string[];
  tags: { [x: string]: any };
  name: string;
  sort?: number;
  matchScore?: number;
  searchable?: boolean;
};

export type PresetsMap = Map<string, Preset>;
export type FieldsMap = Map<string, Field>;

export type Metadata = {
  projectKey?: string;
  name?: string;
  dataset_id?: string;
  version?: string;
};

export type Messages = {
  [id: string]: string;
};

export type State = {
  // A map of presets by preset id
  presets: PresetsMap;
  // A map of field definitions by id
  fields: FieldsMap;
  metadata: Metadata;
  messages: Messages;
  status: Status;
};

export type ConfigContextType = [
  State,
  {
    reload: () => void;
    replace: (
      fileUri: string,
      onSuccess?: (metadata: Metadata) => void
    ) => Promise<void>;
  }
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

export const ConfigProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [config, setConfig] = React.useState(defaultConfig);
  const [status, setStatus] = React.useState<Status>("loading");
  const intl = useIntl();
  const isMounted = useIsMounted();

  const loadConfig = React.useCallback(
    async (locale: string, onSuccess?: (configMetadata: Metadata) => void) => {
      setStatus("loading");

      try {
        const [
          presetsList,
          fieldsList,
          metadata,
          messages,
        ] = await Promise.all([
          api.getPresets(),
          api.getFields(),
          api.getMetadata(),
          api.getConfigMessages(locale),
        ]);

        if (!isMounted()) return; // if component was unmounted, don't set state

        setConfig({
          presets: new Map(
            presetsList.filter(filterPointPreset).map(p => [p.id, p])
          ),
          fields: new Map(fieldsList.map(p => [p.id, p])),
          metadata: metadata,
          messages: messages,
        });

        setStatus("success");

        if (onSuccess) {
          onSuccess(metadata);
        }
      } catch (err) {
        if (err instanceof Error) {
          bugsnag.notify(err, report => {
            report.severity = "error";
          });
        }

        log("Error loading presets and fields", err);

        if (!isMounted()) return; // if component was unmounted, don't set state

        setStatus("error");
      }
    },
    [isMounted]
  );

  const replace = React.useCallback(
    async (fileUri, onSuccess) => {
      try {
        setStatus("loading");
        await api.replaceConfig(fileUri);
        await loadConfig(intl.locale, onSuccess);
      } catch (err) {
        log("Error replacing presets", err);
        setStatus("error");
      }
    },
    [intl.locale, loadConfig]
  );

  // Load presets and fields from Mapeo Core on first mount of the app
  React.useEffect(() => {
    loadConfig(intl.locale);
  }, [intl.locale, loadConfig]);

  const mergedMessages = React.useMemo(
    () => ({
      ...intl.messages,
      ...config.messages,
    }),
    [config.messages, intl.messages]
  );

  const contextValue: ConfigContextType = React.useMemo(
    () => [
      { ...config, status },
      { reload: () => loadConfig(intl.locale), replace },
    ],
    [config, status, loadConfig, replace, intl.locale]
  );

  return (
    <IntlProvider
      wrapRichTextChunksInFragment
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
