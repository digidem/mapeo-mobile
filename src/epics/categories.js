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
    name: 'Rivers and streams',
    icon: require('../images/categories/category_0.png')
  },
  {
    name: 'Tunnels / caves',
    icon: require('../images/categories/category_1.png')
  },
  {
    name: 'Hunting sites',
    icon: require('../images/categories/category_2.png')
  },
  {
    name: 'Fishing sites',
    icon: require('../images/categories/category_3.png')
  },
  {
    name: 'Old houses and farms',
    icon: require('../images/categories/category_4.png')
  },
  {
    name: 'Burial sites',
    icon: require('../images/categories/category_5.png')
  },
  {
    name: 'Medicinal plants',
    icon: require('../images/categories/category_6.png')
  },
  {
    name: 'Resources for artesania',
    icon: require('../images/categories/category_7.png')
  },
  {
    name: 'Gold',
    icon: require('../images/categories/category_8.png')
  },
  {
    name: 'Planted fruit trees',
    icon: require('../images/categories/category_9.png')
  },
  {
    name: 'Yoko',
    icon: require('../images/categories/category_10.png')
  },
  {
    name: 'Yage',
    icon: require('../images/categories/category_11.png')
  },
  {
    name: 'Invisible people',
    icon: require('../images/categories/category_12.png')
  },
  {
    name: 'Waterfalls',
    icon: require('../images/categories/category_13.png')
  },
  {
    name: 'Hills and mountains (sacred)',
    icon: require('../images/categories/category_14.png')
  },
  {
    name: 'Huge special trees',
    icon: require('../images/categories/category_15.png')
  },
  {
    name: 'Boas',
    icon: require('../images/categories/category_16.png')
  },
  {
    name: 'Historical sites',
    icon: require('../images/categories/category_17.png')
  },
  {
    name: 'Plants and animals in danger of extinction',
    icon: require('../images/categories/category_18.png')
  },
  {
    name: 'Threat',
    icon: require('../images/categories/category_18.png')
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
            icon: c.icon
          })
        )
      )
    );

export default [categoryListEpic];
