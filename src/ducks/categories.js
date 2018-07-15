// @flow

import update from 'immutability-helper';
import { keyBy } from 'lodash';
import { create } from '../lib/redux';

export const {
  type: CATEGORY_LIST,
  action: categoryList,
  reducer: categoryListReducer
} = create('CATEGORY_LIST', {
  success: (state, meta, payload) => {
    const newState = update(state, {
      categories: { $set: keyBy(payload, 'id') }
    });

    return newState;
  }
});

export default [categoryListReducer];
