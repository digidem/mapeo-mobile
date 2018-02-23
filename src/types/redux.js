// @flow
import type { Observation } from '@types/observation';
import type { Category } from '@types/category';

export interface AppStoreState {
  observations: {
    [id: string]: Observation
  };

  categories: {
    [id: string]: Category
  };
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
