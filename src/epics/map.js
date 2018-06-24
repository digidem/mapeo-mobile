// @flow
import { Action } from '../types/redux';
import { Observable } from 'rxjs';
import type { Style as StyleType } from '../types/map';
import type { ActionsObservable } from 'redux-observable';
import type { StoreState } from '../types/redux';
import Style from '../api/styles';
import { STYLE_LIST, styleList, styleSelect } from '../ducks/map';

export const styleListEpic = (
  action$: ActionsObservable<Action<string, StyleType[]>>,
  store: StoreState
) =>
  action$
    .ofType(STYLE_LIST)
    .filter(action => action.status === 'Start')
    .flatMap(() =>
      Style.list().flatMap(styles =>
        Observable.merge(
          Observable.of(styleList('', styles)),
          styles.length
            ? Observable.of(styleSelect(styles[1]))
            : Observable.of(null)
        )
      )
    );

export default [styleListEpic];
