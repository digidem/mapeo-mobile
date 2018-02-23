import { combineReducers } from 'redux';
import { combineReducers as appCombineReducers } from '@src/lib/redux';
import MainStackNavigation from '@src/components/MainNavigation/MainStackNavigation';
import TabBarNavigation from '@src/components/Views/TabBarView';

import categories from './categories';
import observations from './observations';

const rootReducer = combineReducers({
  app: appCombineReducers(...categories, ...observations),

  mainStack: (state, action) =>
    MainStackNavigation.router.getStateForAction(action, state),

  tabBar: (state, action) =>
    TabBarNavigation.router.getStateForAction(action, state)
});

export default rootReducer;
