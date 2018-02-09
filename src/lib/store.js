import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from '@epics';
import rootReducer from '@ducks';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

const epicMiddleware = createEpicMiddleware(rootEpic);
const tabBarMiddleware = createReactNavigationReduxMiddleware(
  'tabBar',
  state => state.tabBar,
);
const mainStackMiddleware = createReactNavigationReduxMiddleware(
  'mainStack',
  state => state.mainStack,
);

export function configureStore() {
  const store = createStore(
    rootReducer,
    applyMiddleware(epicMiddleware, tabBarMiddleware, mainStackMiddleware),
  );

  return store;
}

export function createInitialStore() {
  return {
    observations: {},
  };
}
