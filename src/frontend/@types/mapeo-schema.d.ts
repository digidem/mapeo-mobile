// Type definitions for mapeo-schema 3.0.0
// Project: https://github.com/digidem/mapeo-schema/
// Definitions by: Andrew Chou <https://github.com/achou11>

/**
 * Copied from https://github.com/sindresorhus/type-fest/blob/9cfbfc5acc4bdbc8abbdbbe8e1154c4bfc8fae7a/source/basic.d.ts#L15-L45
 */
type JsonObject = { [Key in string]?: JsonValue };
type JsonArray = JsonValue[];
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;

declare module "mapeo-schema" {
  interface Tags {
    [key: string]: JsonValue;
  }

  interface Provider {
    backgroundModeEnabled: boolean;
    gpsAvailable?: boolean;
    passiveAvailable?: boolean;
    locationServicesEnabled: boolean;
    networkAvailable?: boolean;
  }

  export interface Position {
    // Position details, should be self explanatory. Units in meters
    coords: {
      latitude: number;
      longitude: number;
      altitude: number | null;
      accuracy: number | null;
      altitudeAccuracy: number | null;
      heading: number | null;
      speed: number | null;
    };
    // The timestamp of when the current position was obtained
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
        provider?: Provider;
      };
      manualLocation?: boolean;
    };
    refs?: {
      id: string;
    }[];
    schemaVersion: 3;
    tags?: Tags;
    timestamp?: string;
    type: "observation";
    userId?: string;
    version: string;
  }

  export interface Preset {
    additionalFields?: string[];
    addTags?: Tags;
    fields?: string[];
    geometry: ("point" | "vertex" | "line" | "area" | "relation")[];
    icon?: string;
    id: string;
    name: string;
    removeTags?: Tags;
    schemaVersion: 1;
    sort?: number;
    tags: Tags;
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
