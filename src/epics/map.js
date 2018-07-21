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
  store: any
) =>
  action$
    .ofType(STYLE_LIST)
    .filter(action => action.status === 'Start')
    .flatMap(() =>
      Style.list().flatMap(styles => {
        const actions = [Observable.of(styleList('', styles))];

        if (styles.length && !store.getState().map.selectedStyle) {
          actions.push(Observable.of(styleSelect(styles[1])));
        }

        return Observable.merge(...actions);
      })
    );

export default [styleListEpic];
