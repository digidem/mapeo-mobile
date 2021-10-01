// Type definitions for mapeo-schema 3.0.0
// Project: https://github.com/digidem/mapeo-schema/
// Definitions by: Andrew Chou <https://github.com/achou11>

declare module "mapeo-schema" {
  export interface Position {
    coords?: {
      accuracy?: number;
      altitude?: number;
      heading?: number;
      latitude?: number;
      longitude?: number;
      speed?: number;
    };
    mocked?: boolean;
    timestamp: number;
  }

  export interface Observation {
    attachments?: {
      id: string;
      type?: string;
    }[];
    created_at: string;
    deviceId?: string;
    id: string;
    lat?: number | null;
    links?: string[];
    lon?: number | null;
    metadata?: {
      location?: {
        error: boolean;
        permission: "granted" | "denied" | "never_ask_again";
        position?: Position;
        provider?: {
          backgroundModeEnabled: boolean;
          gpsAvailable: boolean;
          passiveAvailable: boolean;
          locationServicesEnabled: boolean;
          networkAvailable: boolean;
        };
      };
      manualLocation?: boolean;
    };
    refs?: {
      id: string;
    }[];
    schemaVersion: 3;
    tags?: {
      [key: string]: any;
    };
    timestamp?: string;
    type: "observation";
    userId?: string;
    version: string;
  }

  export interface Preset {
    additionalFields?: string[];
    addTags?: {
      [key: string]: any;
    };
    fields?: string[];
    geometry: ("point" | "vertex" | "line" | "area" | "relation")[];
    icon?: string;
    id: string;
    name: string;
    removeTags?: {
      [key: string]: any;
    };
    schemaVersion: 1;
    sort?: number;
    tags: {
      [key: string]: any;
    };
    terms?: string[];
  }

  export type Key = string | string[];

  interface BaseField {
    // Additional context about the field, e.g. hints about how to answer the
    // question.
    helperText?: string;
    // A unique id used to reference the field from presets
    id: string;
    // They key in a tags object that this field applies to. For nested
    // properties, key can be an array e.g. for tags = { foo: { bar: 1 } } the key
    // is ['foo', 'bar']
    key: Key;
    label?: string;
    // Displayed as a placeholder or hint for the field: use for additional
    // context or example responses for the user
    placeholder?: string;
    // Displayed, but cannot be edited
    readonly?: boolean;
    // If a field definition contains the property "universal": true, this field
    // will appear in the "Add Field" list for all presets
    universal?: boolean;
  }

  export interface TextField extends BaseField {
    appearance?: "singleline" | "multiline";
    type: "text" | "textarea" | "localized";
    // Spaces are replaced with underscores
    snake_case?: boolean;
  }

  interface BaseSelectField extends BaseField {
    options: SelectOptions;
    // User can enter their own reponse if not on the list (defaults to true on
    // desktop, false on mobile)
    other?: boolean;
    // Spaces are replaced with underscores
    snake_case?: boolean;
    type: "select_one" | "select_multiple";
  }

  export interface SelectOneField extends BaseSelectField {
    type: "select_one";
  }

  export interface SelectMultipleField extends BaseSelectField {
    type: "select_multiple";
  }

  export type SelectableFieldValue = number | string | boolean | null;

  export interface LabeledSelectOption {
    label: string;
    value: SelectableFieldValue;
  }

  export type SelectOptions = (SelectableFieldValue | LabeledSelectOption)[];
}
