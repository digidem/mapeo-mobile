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
    icon: (
      <Image
        source={require('../images/categories/category_0.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Tunnels / caves',
    icon: (
      <Image
        source={require('../images/categories/category_1.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Hunting sites',
    icon: (
      <Image
        source={require('../images/categories/category_2.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Fishing sites',
    icon: (
      <Image
        source={require('../images/categories/category_3.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Old houses and farms',
    icon: (
      <Image
        source={require('../images/categories/category_4.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Burial sites',
    icon: (
      <Image
        source={require('../images/categories/category_5.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Medicinal plants',
    icon: (
      <Image
        source={require('../images/categories/category_6.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Resources for artesania',
    icon: (
      <Image
        source={require('../images/categories/category_7.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Gold',
    icon: (
      <Image
        source={require('../images/categories/category_8.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Planted fruit trees',
    icon: (
      <Image
        source={require('../images/categories/category_9.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Yoko',
    icon: (
      <Image
        source={require('../images/categories/category_10.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Yage',
    icon: (
      <Image
        source={require('../images/categories/category_11.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Invisible people',
    icon: (
      <Image
        source={require('../images/categories/category_12.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Waterfalls',
    icon: (
      <Image
        source={require('../images/categories/category_13.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Hills and mountains (sacred)',
    icon: (
      <Image
        source={require('../images/categories/category_14.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Huge special trees',
    icon: (
      <Image
        source={require('../images/categories/category_15.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Boas',
    icon: (
      <Image
        source={require('../images/categories/category_16.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Historical sites',
    icon: (
      <Image
        source={require('../images/categories/category_17.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Plants and animals in danger of extinction',
    icon: (
      <Image
        source={require('../images/categories/category_18.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Threat',
    icon: (
      <Image
        source={require('../images/categories/category_18.png')}
        style={{ width: 25, height: 25 }}
        resizeMode="contain"
      />
    )
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
