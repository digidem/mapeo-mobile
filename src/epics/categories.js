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
    name: 'Rios y corrientes',
    icon: (
      <Image
        source={require('../images/categories/category_0.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Túneles / cuevas',
    icon: (
      <Image
        source={require('../images/categories/category_1.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Sitios de caza',
    icon: (
      <Image
        source={require('../images/categories/category_2.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Sitios de pesca',
    icon: (
      <Image
        source={require('../images/categories/category_3.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Casas antiguas y granjas',
    icon: (
      <Image
        source={require('../images/categories/category_4.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Cementerios',
    icon: (
      <Image
        source={require('../images/categories/category_5.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Plantas medicinales',
    icon: (
      <Image
        source={require('../images/categories/category_6.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Recursos para artesania',
    icon: (
      <Image
        source={require('../images/categories/category_7.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Oro',
    icon: (
      <Image
        source={require('../images/categories/category_8.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Árboles frutales plantados',
    icon: (
      <Image
        source={require('../images/categories/category_9.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Yoko',
    icon: (
      <Image
        source={require('../images/categories/category_10.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Yage',
    icon: (
      <Image
        source={require('../images/categories/category_11.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Gente invisible',
    icon: (
      <Image
        source={require('../images/categories/category_12.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Cascadas',
    icon: (
      <Image
        source={require('../images/categories/category_13.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Colinas y montañas (sagrado)',
    icon: (
      <Image
        source={require('../images/categories/category_14.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Enormes árboles especiales',
    icon: (
      <Image
        source={require('../images/categories/category_15.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Boas',
    icon: (
      <Image
        source={require('../images/categories/category_16.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Lugares históricos',
    icon: (
      <Image
        source={require('../images/categories/category_17.png')}
        style={{ width: 40, height: 40 }}
        resizeMode="contain"
      />
    )
  },
  {
    name: 'Plantas y animales en peligro de extinció',
    icon: (
      <Image
        source={require('../images/categories/category_18.png')}
        style={{ width: 40, height: 40 }}
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
            id: i,
            icon: c.icon
          })
        )
      )
    );

export default [categoryListEpic];
