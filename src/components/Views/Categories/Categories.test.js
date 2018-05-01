// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import Categories from './Categories';
import { createObservation } from '../../../mocks/observations';
import { createCategory } from '../../../mocks/categories';

describe('Categories tests', () => {
  const addListener = () => true;
  const categories = [createCategory()];
  const selectedObservation = createObservation();
  const listCategories = jest.fn();
  const goToObservationEditor = jest.fn();
  const goBack = jest.fn();
  const updateObservation = jest.fn();

  test('snapshot', () => {
    const tree = renderer
      .create(
        <Categories
          categories={categories}
          isFocused
          selectedObservation={selectedObservation}
          listCategories={listCategories}
          updateObservation={updateObservation}
          goToObservationEditor={goToObservationEditor}
          goBack={goBack}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
