import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel1 from 'redux-persist/lib/stateReconciler/autoMergeLevel1';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import rootEpic from '../epics';
import rootReducer from '../ducks';

const epicMiddleware = createEpicMiddleware(rootEpic);

const persistConfig = {
  key: 'root',
  version: 2,
  storage,
  whitelist: ['settings', 'modals', 'drawers', 'map', 'appReady'],
  stateReconciler: autoMergeLevel1 // see "Merge Process" section for details.
};

export function configureStore() {
  const store = createStore(
    persistReducer(persistConfig, rootReducer),
    composeWithDevTools(applyMiddleware(epicMiddleware))
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
    gps: { status: 'SEARCHING' },
    observationSource: { source: undefined },
    devices: {},
    settings: {
      gpsFormat: 'DD'
    },
    map: {
      styles: {}
    },
    icons: {},
    resizedImages: {},
    attachments: {},
    presets: [],
    selectedPreset: ''
  };
}
