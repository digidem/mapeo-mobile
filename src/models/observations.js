// @flow
import type { Observation } from '../types/observation';

export const applyObservationDefaults = (partial: Object): Observation => ({
  type: 'Rios y corrientes',
  lat: 0,
  lon: 0,
  link: 'link',
  created: new Date(),
  name: '',
  notes: '',
  observedBy: 'You',
  media: [],
  icon: null,
  categoryId: '0',
  fields: [],

  ...partial
});
