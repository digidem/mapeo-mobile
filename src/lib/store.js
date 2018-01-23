import { createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from '@epics';
import rootReducer from '@ducks';

const epicMiddleware = createEpicMiddleware(rootEpic);

export function configureStore() {
  const store = createStore(rootReducer, applyMiddleware(epicMiddleware));

  return store;
}

export function createInitialStore() {
  return {
    observations: {},
  };
}
