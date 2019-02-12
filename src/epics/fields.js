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
import DOMParser from 'react-native-xml2js';

export const presetsSelectEpic = (
  action$: ActionsObservable<Action<string, Field[]>>
) =>
  action$
    .ofType(PRESETS_SELECT)
    .filter(action => action.status === 'Start')
    .flatMap(action =>
      Presets.get(action.meta).flatMap(presets =>
        Observable.concat(
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
          ),
          Observable.of(presetsIconsList(action.meta))
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
      Presets.icons(action.meta).flatMap(iconsString =>
        Observable.create(observer => {
          DOMParser.parseString(iconsString, { trim: true }, (err, result) => {
            if (err) {
              observer.error(err);
            }

            const icons = {};
            const builder = new DOMParser.Builder({
              rootName: 'svg',
              headless: true
            });
            result.svg.symbol.forEach(s => {
              icons[s.$.id] = builder.buildObject(s);
            });
            observer.next(icons);
          });
        })
          .map(icons => presetsIconsList(action.meta, icons))
          .catch(err => Observable.of(presetsIconsList(action.meta, err)))
      )
    );

export default [presetsSelectEpic, presetsIconsListEpic];
