// @flow
import type { ActionsObservable } from 'redux-observable';
import { CATEGORY_LIST, categoryList } from '../ducks/categories';
import { createCategory } from '../mocks/categories';
import type { Action } from '../types/redux';
import type { Category } from '../types/category';

const initialCategories = [
  { name: 'Rios y corrientes' },
  { name: 'Túneles / cuevas' },
  { name: 'Sitios de caza' },
  { name: 'Sitios de pesca' },
  { name: 'Casas antiguas y granjas' },
  { name: 'Cementerios' },
  { name: 'Plantas medicinales' },
  { name: 'Recursos para artesania' },
  { name: 'Oro' },
  { name: 'Árboles frutales plantados' },
  { name: 'Yoko' },
  { name: 'Yage' },
  { name: 'Gente invisible' },
  { name: 'Cascadas' },
  { name: 'Colinas y montañas (sagrado)' },
  { name: 'Enormes árboles especiales' },
  { name: 'Boas' },
  { name: 'Lugares históricos' },
  { name: 'Plantas y animales en peligro de extinció' }
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
            id: i
          })
        )
      )
    );

export default [categoryListEpic];
