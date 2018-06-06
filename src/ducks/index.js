import { combineReducers } from 'redux';
import { createNavigationReducer } from 'react-navigation-redux-helpers';
import { combineReducers as appCombineReducers } from '../lib/redux';
import MainStackNavigation from '../components/MainNavigation/MainStackNavigation';

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

const rootReducer = combineReducers({
  app: appCombineReducers(
    ...categories,
    ...devices,
    ...drawers,
    ...fields,
    ...observationSource,
    ...settings,
    ...gps,
    ...modals,
    ...observations,
    ...map
  ),
  mainStack: createNavigationReducer(MainStackNavigation)
});

export default rootReducer;
