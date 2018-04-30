// @flow
import moment from 'moment';

export const createObservation = (observation?: any) => ({
  type: 'Observation',
  id: 1,
  lat: 50.5,
  lon: 50.5,
  link: 'linkID',
  created: moment('2018-03-25 17:30'),
  name: 'Oil Spill',
  notes:
    'This is pretty bad. It smells pretty noxious, and the entire pond is affected.',
  observedBy: 'You',
  media: [],
  icon: require('../images/categories/category_18.png'),
  categoryId: 19,

  ...observation
});
