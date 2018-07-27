// @flow
import type { Observation } from '../types/observation';
import type { ObservationAPI } from '../api/observations';

export const defaultObservation: Observation = {
  id: '',
  lat: 0,
  lon: 0,
  created: new Date(),
  name: '',
  notes: '',
  observedBy: 'Tú',
  attachments: [],
  categoryId: '',
  fields: []
};

export const parseObservationRequest = (
  observation: Object
): ObservationAPI => {
  const { lat, lon, attachments, version } = observation;
  const tags = { ...observation };

  // remove observation defaults
  const keep = { created: true };
  Object.keys(tags).forEach(property => {
    if (!keep[property] && tags[property] === defaultObservation[property]) {
      delete tags[property];
    }
  });

  // remove topLevel properties
  const topLevel = ['lat', 'lon', 'attachments', 'id'];
  topLevel.forEach(p => delete tags[p]);

  return {
    lat: lat || 0,
    lon: lon || 0,
    version,
    attachments: (attachments || []).map(id => ({ id })),
    type: 'observation',
    device_id: '1',
    tags
  };
};

export const parseObservationResponse = (observation: Object): Observation => {
  const obs = {
    ...defaultObservation,
    ...observation.tags,
    id: observation.id,
    lat: observation.lat,
    lon: observation.lon,
    attachments: observation.attachments.map(a => a.id),
    version: observation.version
  };

  return obs;
};
