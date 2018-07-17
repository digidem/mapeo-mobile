// @flow
import type { Observation } from '../types/observation';

export const applyObservationDefaults = (partial: Object): Observation => ({
  type: 'Rios y corrientes',
  link: 'link',
  created: new Date(),
  name: '',
  notes: '',
  observedBy: 'Tú',
  attachments: [],
  icon: null,
  categoryId: '0',
  fields: [],

  ...partial.properties,

  id: partial.id,
  lat: parseFloat(partial.lat) || parseFloat(partial.properties.lat) || 0,
  lon: parseFloat(partial.lon) || parseFloat(partial.properties.lon) || 0
});

export const emptyObservation = (id: string, lat?: string, lon?: string) => ({
  type: 'Rios y corrientes',
  link: 'link',
  created: new Date(),
  name: '',
  notes: '',
  observedBy: 'Tú',
  attachments: [],
  icon: null,
  categoryId: '0',
  fields: [],
  id,
  lat: lat || 0,
  lon: lon || 0
});
