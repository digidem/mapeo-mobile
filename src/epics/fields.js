// @flow
import React from 'react';
import { Observable } from 'rxjs';
import type { ActionsObservable } from 'redux-observable';
import {
  PRESETS_SELECT,
  presetsSelect,
  fieldList,
  presetsIconsList,
  PRESETS_ICONS_LIST
} from '../ducks/fields';
import { categoryList } from '../ducks/categories';
import type { Action } from '../types/redux';
import type { Field } from '../types/field';
import { values } from 'lodash';
import Presets from '../api/presets';

export const presetsSelectEpic = (
  action$: ActionsObservable<Action<string, Field[]>>
) =>
  action$
    .ofType(PRESETS_SELECT)
    .filter(action => action.status === 'Start')
    .flatMap(action =>
      Presets.get(action.meta).flatMap(presets =>
        Observable.merge(
          Observable.of(presetsIconsList(action.meta)),
          Observable.of(
            fieldList(
              '',
              Object.keys(presets.fields).map(k => ({
                name: presets.fields[k].key,
                id: k,
                type: presets.fields[k].type,
                placeholder: presets.fields[k].placeholder,
                answered: false,
                answer: ''
              }))
            )
          ),
          Observable.of(
            categoryList(
              '',
              Object.keys(presets.presets).map(k => ({
                name: presets.presets[k].name,
                id: k,
                icon: presets.presets[k].icon,
                fields: presets.presets[k].fields
              }))
            )
          )
        )
      )
    );

export const presetsIconsListEpic = (
  action$: ActionsObservable<Action<string, Field[]>>
) =>
  action$
    .ofType(PRESETS_ICONS_LIST)
    .filter(action => action.status === 'Start')
    .flatMap(action =>
      Presets.icons(action.meta).map(icons =>
        presetsIconsList(action.meta, icons)
      )
    );

export default [presetsSelectEpic, presetsIconsListEpic];
