// @flow
import type { Observation } from './observation';
import type { Category } from './category';
import type { ModalState } from './modal';
import type { DrawerState } from './drawer';
import type { GPSState } from './gps';
import type { Field } from './field';
import type { ObservationSourceState } from './observationSource';

export interface AppStoreState {
  observations: {
    [id: string]: Observation
  };

  categories: {
    [id: string]: Category
  };

  selectedObservation?: Observation;

  modals: ModalState;

  drawers: DrawerState;

  gps: Resource<GPSState>;

  fields: {
    [id: string]: Field
  };

  observationSource: ObservationSourceState;
}

export interface StoreState {
  app: AppStoreState;

  mainStack: any;
}

export type ActionStatus = 'Start' | 'Error' | 'Success';

export interface Action<M, P> {
  type: string;
  status: ActionStatus;
  meta: M;
  payload?: P;
  error?: Error;
}

export interface Reducers<M, P> {
  start?: (state: AppStoreState, action: Action<M, P>) => AppStoreState;
  success?: (state: AppStoreState, action: Action<M, P>) => AppStoreState;
  error?: (state: AppStoreState, action: Action<M, P>) => AppStoreState;
}

export type ResourceStatus = 'Pending' | 'Success' | 'Failed';

export interface Resource<M> {
  status: ResourceStatus;
  data: M;
  error?: Error;
}
