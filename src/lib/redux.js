// @flow
import { StoreState, Action, Reducers } from '@types/redux';
import { createInitialStore } from './store';

export function create<M, P>(
  type: string,
  reducers: Reducers<M, P>,
): {
  type: string,
  action: (meta: M, payload?: P, error?: Error) => Action<M, P>,
  reducer: (state: StoreState, action: Action<M, P>) => StoreState,
} {
  return {
    type,
    action: (meta: M, payload?: P, error?: Error) => {
      if (payload === undefined) {
        return { type, status: 'Start', meta };
      } else if (error) {
        return {
          type,
          status: 'Error',
          meta,
          error,
        };
      }
      return {
        type,
        status: 'Success',
        meta,
        payload,
      };
    },
    reducer: (state: StoreState, action: Action<M, P>) => {
      if (action.type === type) {
        switch (action.status) {
          case 'Start':
            if (reducers.start) {
              return reducers.start(state, action);
            }
            break;
          case 'Error':
            if (reducers.error) {
              return reducers.error(state, action);
            }
            break;
          case 'Success':
            if (reducers.success) {
              return reducers.success(state, action);
            }
            break;
          default:
            break;
        }
      }

      return state === undefined ? createInitialStore() : state;
    },
  };
}

export const combineReducers = (...reducers: Function[]): Function =>
  (state: StoreState, action: Action<any, any>) => {
    let newState = state;
    reducers.forEach((reducer) => {
      newState = reducer(newState, action);
    });
    return newState;
  };
