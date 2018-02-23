// @flow
import { CATEGORY_LIST, categoryList } from '@ducks/categories';
import { createCategory } from '@mocks/categories';
import type { Action } from '@types/redux';
import type { Category } from '@types/category';
import type { ActionsObservable } from 'redux-observable';

const initialCategories = [
  { name: 'Rios y corrientes' },
  { name: 'Túneles/cuevas' },
  { name: 'Sitios de caza' },
  { name: 'Sitios de pesca' },
  { name: 'Casa antiguas y granjas' },
  { name: 'Cementerios' },
  { name: 'Plantas medicinales' },
  { name: 'Recursos para artesania' },
  { name: 'Oro' },
  { name: 'Arboles frutales plantados' },
  { name: 'Yoko' },
  { name: 'Yage' },
  { name: 'Gente invisible' },
  { name: 'Cascadas' },
  { name: 'Colinas y montanas (sagrado)' },
  { name: 'Enormes arboles especiales' },
  { name: 'Boas' },
  { name: 'Lugares historicos' },
  { name: 'Plantas y animales en peligro de extincion' }
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
