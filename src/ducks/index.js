import { combineReducers } from 'redux';
import MainStackNavigation from '@src/components/MainNavigation/MainStackNavigation';
import TabBarNavigation from '@src/components/Views/TabBarView';

import observations from './observations';

const rootReducer = combineReducers({
  ...observations,

  mainStack: (state, action) =>
    MainStackNavigation.router.getStateForAction(action, state),

  tabBar: (state, action) =>
    TabBarNavigation.router.getStateForAction(action, state),

});

export default rootReducer;
