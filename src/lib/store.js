import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { createEpicMiddleware } from 'redux-observable';
import rootEpic from '../epics';
import rootReducer from '../ducks';

const epicMiddleware = createEpicMiddleware(rootEpic);

const persistConfig = {
  key: 'root',
  storage,
  stateReconciler: autoMergeLevel2 // see "Merge Process" section for details.
};

export function configureStore() {
  const store = createStore(
    persistReducer(persistConfig, rootReducer),
    applyMiddleware(epicMiddleware)
  );
  const persistor = persistStore(store);

  return { store, persistor };
}

export function createInitialStore() {
  return {
    observations: {},
    categories: {},
    fields: {},
    modals: {
      saved: false,
      cancelled: false,
      manualGPS: false,
      synced: false
    },
    drawers: {
      observations: false
    },
    gps: { status: 'Pending' },
    observationSource: { source: undefined },
    devices: {},
    settings: {
      gpsFormat: 'DD'
    },
    map: {
      styles: {}
    },
    syncAnnounced: false
  };
}
