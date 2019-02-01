import { combineReducers } from 'redux';
import { combineReducers as appCombineReducers } from '../lib/redux';

import categories from './categories';
import modals from './modals';
import observations from './observations';
import gps from './gps';
import fields from './fields';
import observationSource from './observationSource';
import devices from './devices';
import settings from './settings';
import map from './map';
import media from './media';
import sync from './sync';

const rootReducer = appCombineReducers(
  ...categories,
  ...devices,
  ...fields,
  ...observationSource,
  ...settings,
  ...gps,
  ...modals,
  ...observations,
  ...map,
  ...media,
  ...sync
);

export default rootReducer;
