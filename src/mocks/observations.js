// @flow

export const createObservation = (observation?: any) => ({
  type: 'Observation',
  id: 'ObservationID',
  lat: 50.5,
  lon: 50.5,
  link: 'linkID',
  created: 'Thu Apr 05 2018 23:06:45 GMT+0200 (CEST)',
  name: 'Oil Spill',
  notes:
    'This is pretty bad. It smells pretty noxious, and the entire pond is affected.',
  observedBy: 'You',
  media: [],
  icon: null,

  ...observation
});
