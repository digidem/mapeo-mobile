// @flow

export const createCategory = (category?: any) => ({
  id: 'categoryID',
  name: 'categoryName',

  ...category
});
