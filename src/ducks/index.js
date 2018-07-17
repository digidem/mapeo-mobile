import { combineReducers } from 'redux';
import { combineReducers as appCombineReducers } from '../lib/redux';

import app from './app';
import categories from './categories';
import drawers from './drawers';
import modals from './modals';
import observations from './observations';
import gps from './gps';
import fields from './fields';
import observationSource from './observationSource';
import devices from './devices';
import settings from './settings';
import map from './map';
import media from './media';

const rootReducer = appCombineReducers(
  ...categories,
  ...devices,
  ...drawers,
  ...fields,
  ...observationSource,
  ...settings,
  ...gps,
  ...modals,
  ...observations,
  ...map,
  ...media,
  ...app
);

export default rootReducer;
