// @flow

export const createField = (field?: any) => ({
  id: '0',
  name: 'fieldName',
  type: 'text',
  placeholder: 'this is some placeholder text',
  answered: false,
  answer: '',

  ...field
});
