// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import Categories from './Categories';
import { createObservation } from '../../../mocks/observations';
import { createCategory } from '../../../mocks/categories';
import { createField } from '../../../mocks/fields';

describe('Categories tests', () => {
  const addListener = () => true;
  const categories = [createCategory()];
  const selectedObservation = createObservation();
  const listCategories = jest.fn();
  const updateObservation = jest.fn();
  const clearSelectedObservation = jest.fn();
  const field = createField();

  test('snapshot', () => {
    const tree = renderer
      .create(
        <Categories
          categories={categories}
          isFocused
          selectedObservation={selectedObservation}
          listCategories={listCategories}
          updateObservation={updateObservation}
          allFields={{ [field.id]: field }}
          updateFlow={false}
          clearSelectedObservation={clearSelectedObservation}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
