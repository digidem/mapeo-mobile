// @flow
import type { Field } from '../types/field';

export const computeField = (partial: Object): Field => ({
  id: partial.key,
  name: partial.label || '',
  type: partial.type || 'text',
  placeholder: partial.placeholder || '',
  answered: false,
  answer: ''
});
