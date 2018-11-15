import { combineEpics } from 'redux-observable';
import categories from './categories';
import observations from './observations';
import fields from './fields';
import sync from './sync';
import map from './map';
import media from './media';

const rootEpics = combineEpics(
  ...categories,
  ...sync,
  ...observations,
  ...fields,
  ...map,
  ...media
);

export default rootEpics;
