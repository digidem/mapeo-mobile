// @flow

export const createObservation = (observation?: any) => ({
  type: 'Observation',
  id: 1,
  lat: 50.5,
  lon: 50.5,
  link: 'linkID',
  created: new Date('2018-02-25T20:23:00.000Z'),
  name: 'Oil Spill',
  notes:
    'This is pretty bad. It smells pretty noxious, and the entire pond is affected.',
  observedBy: 'You',
  media: [],
  icon: require('../images/categories/category_18.png'),
  categoryId: 19,

  ...observation
});
