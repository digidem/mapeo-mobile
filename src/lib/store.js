import { createStore, applyMiddleware } from 'redux';
import {
  createReactNavigationReduxMiddleware,
  createReduxBoundAddListener
} from 'react-navigation-redux-helpers';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from '../epics';
import rootReducer from '../ducks';

const epicMiddleware = createEpicMiddleware(rootEpic);
const tabBarMiddleware = createReactNavigationReduxMiddleware(
  'tabBar',
  state => state.tabBar
);
const mainStackMiddleware = createReactNavigationReduxMiddleware(
  'mainStack',
  state => state.mainStack
);
export const tabBarAddListener = createReduxBoundAddListener('tabBar');
export const mainStackAddListener = createReduxBoundAddListener('mainStack');

export function configureStore() {
  const store = createStore(
    rootReducer,
    applyMiddleware(mainStackMiddleware, epicMiddleware, tabBarMiddleware)
  );

  return store;
}

export function createInitialStore() {
  return {
    observations: {}
  };
}
