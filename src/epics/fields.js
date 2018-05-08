// @flow
import React from 'react';
import type { ActionsObservable } from 'redux-observable';
import { FIELD_LIST, fieldList } from '../ducks/fields';
import { createField } from '../mocks/fields';
import type { Action } from '../types/redux';
import type { Field } from '../types/field';

const initialFields = [
  {
    name: 'Building type',
    type: 'text',
    placeholder: 'School/hospital/etc'
  },
  {
    name: 'Animal type',
    type: 'text',
    placeholder: 'What kind of animal'
  },
  {
    name: 'Name',
    type: 'text',
    placeholder: 'Name (if exists)'
  },
  {
    name: 'Items gathered',
    type: 'text',
    placeholder: 'What is collected here'
  },
  {
    name: 'Palm species',
    type: 'text',
    placeholder: 'What kind of palm'
  },
  {
    name: 'Owner',
    type: 'text',
    placeholder: 'Owner or user of the place'
  },
  {
    name: 'Plant species',
    type: 'text',
    placeholder: 'What kind of plant'
  },
  {
    name: 'Source',
    type: 'text',
    placeholder: 'Source of the data'
  },
  {
    name: 'Tree species',
    type: 'text',
    placeholder: 'What kind of tree'
  },
  {
    name: 'Type',
    type: 'text',
    placeholder: 'What kind of path'
  }
];

export const fieldListEpic = (
  action$: ActionsObservable<Action<string, Field[]>>
) =>
  action$
    .ofType(FIELD_LIST)
    .filter(action => action.status === 'Start')
    .map(() =>
      fieldList(
        '',
        initialFields.map((f, i) =>
          createField({
            name: f.name,
            id: i.toString(),
            type: f.type,
            placeholder: f.placeholder
          })
        )
      )
    );

export default [fieldListEpic];
