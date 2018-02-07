import { combineReducers } from 'redux';
import observations from './observations';

import MainStackNavigation from '@src/components/MainNavigation/MainStackNavigation';
import TabBarNavigation from '@src/components/Views/TabBarView/TabBarNavigation';

const rootReducer = combineReducers({
  ...observations,

  mainStack: (state, action) =>
    MainStackNavigation.router.getStateForAction(action, state),

  tabBar: (state, action) =>
    TabBarNavigation.router.getStateForAction(action, state),

});

export default rootReducer;
