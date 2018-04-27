import { combineReducers } from 'redux';
import { combineReducers as appCombineReducers } from '../lib/redux';
import MainStackNavigation from '../components/MainNavigation/MainStackNavigation';
import TabBarNavigation from '../components/Views/TabBarNavigation';

import categories from './categories';
import observations from './observations';

const rootReducer = combineReducers({
  app: appCombineReducers(...categories, ...observations),

  mainStack: (state, action) =>
    MainStackNavigation.router.getStateForAction(action, state)
});

export default rootReducer;
