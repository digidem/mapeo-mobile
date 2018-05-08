// @flow

export const createCategory = (category?: any) => ({
  id: 'categoryID',
  name: 'categoryName',
  fieldIds: [0],

  ...category
});
