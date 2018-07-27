// @flow
import type { Resource } from './redux';
import type { Field } from './field';

export type Attachment = {
  id: string,
  type: string, //mime type
  observation?: string
};

export type Observation = {
  id: string,
  lat: number,
  lon: number,
  created: Date,
  name: string,
  notes: string,
  observedBy: string,
  attachments: string[],
  categoryId: string,
  fields: Field[],
  version?: string
};
