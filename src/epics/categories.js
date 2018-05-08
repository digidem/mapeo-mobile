// @flow
import React from 'react';
import type { ActionsObservable } from 'redux-observable';
import { Image } from 'react-native';
import { CATEGORY_LIST, categoryList } from '../ducks/categories';
import { createCategory } from '../mocks/categories';
import type { Action } from '../types/redux';
import type { Category } from '../types/category';

const initialCategories = [
  {
    name: 'River/stream',
    icon: require('../images/categories/category_0.png'),
    fieldIds: [7]
  },
  {
    name: 'Tunnel/cave',
    icon: require('../images/categories/category_1.png'),
    fieldIds: [7]
  },
  {
    name: 'Hunting site',
    icon: require('../images/categories/category_2.png'),
    fieldIds: [7]
  },
  {
    name: 'Fishing site',
    icon: require('../images/categories/category_3.png'),
    fieldIds: [7]
  },
  {
    name: 'Old house/farm',
    icon: require('../images/categories/category_4.png'),
    fieldIds: [7, 5]
  },
  {
    name: 'Burial site',
    icon: require('../images/categories/category_5.png'),
    fieldIds: [7]
  },
  {
    name: 'Medicinal plant',
    icon: require('../images/categories/category_6.png'),
    fieldIds: [7, 6]
  },
  {
    name: 'Resource for artesania',
    icon: require('../images/categories/category_7.png'),
    fieldIds: [7, 6]
  },
  {
    name: 'Gold',
    icon: require('../images/categories/category_8.png'),
    fieldIds: [7]
  },
  {
    name: 'Planted fruit tree',
    icon: require('../images/categories/category_9.png'),
    fieldIds: [7, 8]
  },
  {
    name: 'Yoko',
    icon: require('../images/categories/category_10.png'),
    fieldIds: [7]
  },
  {
    name: 'Yage',
    icon: require('../images/categories/category_11.png'),
    fieldIds: [7]
  },
  {
    name: 'Invisible person',
    icon: require('../images/categories/category_12.png'),
    fieldIds: [7, 2]
  },
  {
    name: 'Waterfall',
    icon: require('../images/categories/category_13.png'),
    fieldIds: [7, 2]
  },
  {
    name: 'Hill/mountain (sacred)',
    icon: require('../images/categories/category_14.png'),
    fieldIds: [7, 2]
  },
  {
    name: 'Huge special tree',
    icon: require('../images/categories/category_15.png'),
    fieldIds: [7, 2, 8]
  },
  {
    name: 'Boa',
    icon: require('../images/categories/category_16.png'),
    fieldIds: [7]
  },
  {
    name: 'Historical site',
    icon: require('../images/categories/category_17.png'),
    fieldIds: [7, 2]
  },
  {
    name: 'Plant/animal in danger of extinction',
    icon: require('../images/categories/category_18.png'),
    fieldIds: [7, 6]
  },
  {
    name: 'Threat',
    icon: require('../images/categories/category_18.png'),
    fieldIds: [7]
  }
];

export const categoryListEpic = (
  action$: ActionsObservable<Action<string, Category[]>>
) =>
  action$
    .ofType(CATEGORY_LIST)
    .filter(action => action.status === 'Start')
    .map(() =>
      categoryList(
        '',
        initialCategories.map((c, i) =>
          createCategory({
            name: c.name,
            id: i.toString(),
            icon: c.icon,
            fieldIds: c.fieldIds
          })
        )
      )
    );

export default [categoryListEpic];
