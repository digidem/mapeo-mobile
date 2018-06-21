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
import settings from './settings';

const rootReducer = combineReducers({
  app: appCombineReducers(
    ...categories,
    ...drawers,
    ...modals,
    ...observations,
    ...gps,
    ...fields,
    ...observationSource,
    ...settings
  ),
  mainStack: createNavigationReducer(MainStackNavigation)
});

export default rootReducer;
