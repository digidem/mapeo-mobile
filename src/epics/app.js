// @flow
import React from 'react';
import { Observable } from 'rxjs';
import type { ActionsObservable } from 'redux-observable';
import { Image } from 'react-native';
import { APP_READY, appReady } from '../ducks/app';
import { observationList } from '../ducks/observations';
import { styleList } from '../ducks/map';
import { fieldList } from '../ducks/fields';
import { categoryList } from '../ducks/categories';
import { createCategory } from '../mocks/categories';
import type { Action } from '../types/redux';
import type { Category } from '../types/category';
import App from '../api/app';

export const appReadyEpic = (
  action$: ActionsObservable<Action<string, Category[]>>
) =>
  action$
    .ofType(APP_READY)
    .filter(action => action.status === 'Start')
    .flatMap(() =>
      App.ready()
        .flatMap(() => {
          return Observable.merge(
            Observable.of(appReady('', true)),
            Observable.of(observationList('')),
            Observable.of(styleList('')),
            Observable.of(categoryList(''))
          );
        })
        .catch(err => {
          return Observable.of(appReady('', err));
        })
    );

export default [appReadyEpic];
