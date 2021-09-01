// Refer to https://github.com/digidem/mapeo-schema/blob/master/docs/README.md
declare module "mapeo-schema" {
  interface Common {
    created_at: string;
    deviceId?: string;
    id: string;
    links?: string[];
    schemaVersion: number;
    timestamp?: string;
    userId?: string;
    type: string;
  }

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
      lastSavedPosition?: Position;
      manualLocation?: boolean;
      position?: Position;
      positionProvider?: {
        gpsAvailable?: boolean;
        locationServicesEnabled?: boolean;
        networkAvailable?: boolean;
        passiveAvailable?: boolean;
      };
    };
    refs?: {
      id: string;
    }[];
    schemaVersion: number;
    tags?: {
      [key: string]: any;
    };
    timestamp?: string;
    type: "observation";
    userId?: string;
    version: string;
  }

  export interface Preset {
    addTags?: {
      [key: string]: any;
    };
    additionalFields?: string[];
    fields?: string[];
    geometry: ("point" | "vertex" | "line" | "area" | "relation")[];
    icon?: string;
    id: string;
    name: string;
    removeTags?: {
      [key: string]: any;
    };
    schemaVersion: number;
    sort?: number;
    tags: {
      [key: string]: any;
    };
    terms?: string[];
  }

  type MbFilter = (string | number | boolean | MbFilter)[];

  export interface Filter {
    created_at: string;
    deviceId?: string;
    filter: MbFilter;
    id: string;
    links?: string[];
    name: string;
    schemaVersion: number;
    timestamp?: string;
    type: "filter";
    userId?: string;
    version: string;
  }

  export type Key = string | Array<string>;

  interface BaseField {
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
    // Additional context about the field, e.g. hints about how to answer the
    // question.
    helperText?: string;
    // If a field definition contains the property "universal": true, this field
    // will appear in the "Add Field" list for all presets
    universal?: boolean;
    // Displayed, but cannot be edited
    readonly?: boolean;
  }

  // type FieldType =
  //   | 'text'
  //   | 'number'
  //   | 'select_one'
  //   | 'select_multiple'
  //   | 'date'
  //   | 'datetime'

  export interface TextField extends BaseField {
    type: "text" | "textarea" | "localized";
    appearance?: "singleline" | "multiline";
    // Spaces are replaced with underscores
    snake_case?: boolean;
  }

  export interface LinkField extends BaseField {
    type: "link";
  }

  export interface NumberField extends BaseField {
    type: "number";
    min_value?: number;
    max_value?: number;
  }

  export type SelectableFieldValue = number | string | boolean | null;

  export interface LabeledSelectOption {
    value: SelectableFieldValue;
    label: string;
  }

  export type SelectOptions = (SelectableFieldValue | LabeledSelectOption)[];

  interface BaseSelectField extends BaseField {
    type: "select_one" | "select_multiple";
    options: SelectOptions;
    // User can enter their own reponse if not on the list (defaults to true on
    // desktop, false on mobile)
    other?: boolean;
    // Spaces are replaced with underscores
    snake_case?: boolean;
  }

  export interface SelectOneField extends BaseSelectField {
    type: "select_one";
  }

  export interface SelectMultipleField extends BaseSelectField {
    type: "select_multiple";
  }

  interface BaseDateField extends BaseField {
    type: "date" | "datetime";
    min_value?: string;
    max_value?: string;
  }

  export interface DateField extends BaseDateField {
    type: "date";
  }

  export interface DateTimeField extends BaseDateField {
    type: "datetime";
  }
}
