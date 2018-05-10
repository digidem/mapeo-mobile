// @flow

import update from 'immutability-helper';
import { keyBy } from 'lodash';
import { create } from '../lib/redux';

export const {
  type: FIELD_LIST,
  action: fieldList,
  reducer: fieldListReducer
} = create('FIELD_LIST', {
  success: (state, action) => {
    const newState = update(state, {
      fields: { $set: keyBy(action.payload, 'id') }
    });

    return newState;
  }
});

export default [fieldListReducer];
