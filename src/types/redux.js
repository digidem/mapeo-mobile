// @flow
export interface StoreState {}

export type ActionStatus = 'Start' | 'Error' | 'Success';

export interface Action<M, P> {
  type: string;
  status: ActionStatus;
  meta: M;
  payload?: P;
  error?: Error;
}

export interface Reducers<M, P> {
  start?: Reducer<M, P>;
  success?: Reducer<M, P>;
  error?: Reducer<M, P>;
}

export type Reducer<M, P> = (state: StoreState, action: Action<M, P>) => StoreState;
