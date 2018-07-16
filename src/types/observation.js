// @flow
import type { Resource } from './redux';
import type { Field } from './field';

export type Attachment = {
  id: string,
  type: string, //mime type
  originalFallback: string,
  thumbnailFallback?: string,
  observation?: string
};

export type Observation = {
  type: string,
  id: string,
  lat: number,
  lon: number,
  link: string,
  created: Date,
  name: string,
  notes: string,
  observedBy: string,
  attachments: string[],
  categoryId: string,
  fields: Field[]
};
