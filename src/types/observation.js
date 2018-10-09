// @flow
import type { Resource } from './redux';
import type { Field } from './field';

export type Attachment = {
  id: string,
  type: string, //mime type
  observation?: string
};

export type UpdateRequest = {
  id: string
};

export type Observation = {|
  id?: string,
  version?: string,
  created_at: string,
  lat?: number,
  lon?: number,
  notes: string,
  categoryId: string,
  attachments: string[],
  fields: Field[]
|};

// Observation get response
export type ServerObservationResponse = {|
  id: string,
  version: string,
  created_at: string,
  timestamp: string,
  lat?: number,
  lon?: number,
  schemaVersion: 3,
  ref?: string,
  metadata?: {},
  attachments?: Array<{ id: string }>,
  fields?: Field[],
  tags?: {
    name: string,
    notes: string,
    categoryId: string
  }
|};

// Observation create request
export type ServerObservationCreate = {|
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
