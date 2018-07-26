// @flow

import update from 'immutability-helper';
import { keyBy } from 'lodash';
import { create } from '../lib/redux';

export const {
  type: FIELD_LIST,
  action: fieldList,
  reducer: fieldListReducer
} = create('FIELD_LIST', {
  success: (state, meta, payload) => {
    const newState = update(state, {
      fields: { $set: keyBy(payload, 'id') }
    });

    return newState;
  }
});

export default [fieldListReducer];
