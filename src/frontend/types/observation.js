// @flow

export type Attachment = {
  id: string,
  type: string // mime type
};

export type Observation = {|
  id?: string,
  version?: string,
  created_at: string,
  lat?: number,
  lon?: number,
  notes: string,
  categoryId: string,
  attachments: string[]
|};

// Observation get response
export type ServerObservationResponse = {|
  id: string,
  version: string,
  created_at: string,
  timestamp: string,
  type: "observation",
  lat?: number,
  lon?: number,
  schemaVersion: 3,
  ref?: string,
  metadata?: {},
  attachments?: Array<{ id: string }>,
  tags?: {
    name: string,
    notes: string,
    categoryId: string
  }
|};

// Observation create request
export type ServerObservationCreate = {|
  type: "observation",
  lat?: number,
  lon?: number,
  schemaVersion: 3,
  ref?: string,
  metadata?: {},
  attachments: Array<{ id: string }>,
  fields: Field[],
  tags: {
    name: string,
    notes: string,
    categoryId: string
  }
|};
