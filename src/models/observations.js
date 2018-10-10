// @flow
import type {
  Observation,
  ServerObservationCreate,
  ServerObservationResponse
} from '../types/observation';

export const createDefaultObservation = (): Observation => ({
  created_at: new Date().toISOString(),
  notes: '',
  categoryId: '',
  attachments: [],
  fields: []
});

// Properties at the top level of a server observation object
const SERVER_PROPS: Array<$Keys<ServerObservationResponse>> = [
  'id',
  'version',
  'created_at',
  'timestamp',
  'type',
  'lon',
  'lat',
  'schemaVersion',
  'ref',
  'metadata',
  'attachments',
  'fields',
  'tags'
];

// Properties at top level of local observation object copied from server obj
const LOCAL_PROPS: Array<$Keys<Observation>> = [
  'id',
  'version',
  'created_at',
  'lat',
  'lon',
  'fields'
];

export const parseObservationRequest = (
  observation: Observation
): ServerObservationCreate | ServerObservationResponse => {
  const serverObservation: Object = { tags: {} };

  // Maintain top-level props and copy other props as tags
  Object.keys(observation).forEach(prop => {
    if (SERVER_PROPS.includes(prop)) {
      serverObservation[prop] = observation[prop];
    } else {
      serverObservation.tags[prop] = observation[prop];
    }
  });

  // set field answers as individual tags
  observation.fields.forEach(field => {
    serverObservation.tags[field.name] = field.answer;
  });

  serverObservation.attachments = (observation.attachments || []).map(a => ({
    id: a
  }));

  serverObservation.type = 'observation';

  return serverObservation;
};

export const parseObservationResponse = (
  serverObservation: ServerObservationResponse
): Observation => {
  const obs = createDefaultObservation();

  Object.keys(serverObservation).forEach(prop => {
    if (LOCAL_PROPS.includes(prop)) {
      // $FlowFixMe
      obs[prop] = serverObservation[prop];
    }
  });

  obs.attachments = (serverObservation.attachments || []).map(a => a.id);

  const tags = serverObservation.tags || {};
  obs.notes = tags.notes || '';
  obs.categoryId = tags.categoryId || '';

  return obs;
};
