// @flow
import { Observation } from '@types/observation';

export interface StoreState {
  observations: {
    [id: string]: Observation,
  };

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
