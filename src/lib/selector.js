// @flow
import { StoreState } from '@src/types/redux';
import { memoize, MemoizedFunction } from 'lodash';

export function createSelector<
  ArgumentType,
  StateProps,
  ReturnType
>(
  stateProps: Array<Function>,
  callback: (...args: Array<StateProps | ArgumentType>) => ReturnType,
  customHash?: Function,
  scopeStateProps?: string[],
) {
  memoize.Cache = Map;
  const memoized: MemoizedFunction = customHash ?
    memoize(callback, customHash) : memoize(callback);
  let prevState: StoreState;

  return function selector(state: StoreState, ...args: ArgumentType[]) {
    const newStateProps = stateProps
      .map(props => props(state, ...args));
    const memoArgs = newStateProps.concat(args);
    let shouldClearCache = prevState !== state;

    if (scopeStateProps && prevState) {
      shouldClearCache = false;
      scopeStateProps.forEach((prop) => {
        // $FlowFixMe
        if (prevState[prop] !== state[prop]) {
          shouldClearCache = true;
        }
      });
    }

    if (!prevState || shouldClearCache) {
      prevState = state;
      memoized.cache.clear();
    }

    return memoized(...memoArgs);
  };
}
