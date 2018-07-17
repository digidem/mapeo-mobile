import { combineEpics } from 'redux-observable';
import app from './app';
import categories from './categories';
import observations from './observations';
import fields from './fields';
import devices from './devices';
import map from './map';
import media from './media';

const rootEpics = combineEpics(
  ...app,
  ...categories,
  ...devices,
  ...observations,
  ...fields,
  ...map,
  ...media
);

export default rootEpics;
