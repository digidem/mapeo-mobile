// @flow
import React from 'react';
import type { ActionsObservable } from 'redux-observable';
import {
  FIELD_LIST,
  fieldList,
  PRESETS_SELECT,
  presetsSelect
} from '../ducks/fields';
import { createField } from '../mocks/fields';
import type { Action } from '../types/redux';
import type { Field } from '../types/field';
import { values } from 'lodash';
import Presets from '../api/presets';

export const fieldListEpic = (
  action$: ActionsObservable<Action<string, Field[]>>
) =>
  action$
    .ofType(FIELD_LIST)
    .filter(action => action.status === 'Start')
    .flatMap(() => Presets.list().map(list => presetsSelect(list[0])));

export const presetsSelectEpic = (
  action$: ActionsObservable<Action<string, Field[]>>
) =>
  action$
    .ofType(PRESETS_SELECT)
    .filter(action => action.status === 'Start')
    .flatMap(action =>
      Presets.get(action.meta).map(presets =>
        fieldList(
          '',
          values(presets.fields).map((f, i) =>
            createField({
              name: f.key,
              id: i.toString(),
              type: f.type,
              placeholder: f.placeholder
            })
          )
        )
      )
    );

export default [fieldListEpic, presetsSelectEpic];
