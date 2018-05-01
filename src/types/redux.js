// @flow
import type { Observation } from './observation';
import type { Category } from './category';
import type { ModalState } from './modal';
import type { DrawerState } from './drawer';

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
}

export interface StoreState {
  app: AppStoreState;

  tabBar: any;
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
  start?: (state: StoreState, action: Action<M, P>) => StoreState;
  success?: (state: StoreState, action: Action<M, P>) => StoreState;
  error?: (state: StoreState, action: Action<M, P>) => StoreState;
}
