// @flow
import React from 'react';
import type { ActionsObservable } from 'redux-observable';
import { Image } from 'react-native';
import { CATEGORY_LIST, categoryList } from '../ducks/categories';
import { PRESETS_SELECT, presetsSelect } from '../ducks/fields';
import { createCategory } from '../mocks/categories';
import type { Action } from '../types/redux';
import type { Category } from '../types/category';
import Presets from '../api/presets';

export const categoryListEpic = (
  action$: ActionsObservable<Action<string, Category[]>>
) =>
  action$
    .ofType(CATEGORY_LIST)
    .filter(action => action.status === 'Start')
    .flatMap(() => Presets.list().map(list => presetsSelect(list[0])));

export default [categoryListEpic];
