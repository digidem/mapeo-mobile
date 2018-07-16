// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import Categories from './Categories';
import { createObservation } from '../../../mocks/observations';
import { createCategory } from '../../../mocks/categories';
import { createField } from '../../../mocks/fields';
import { createNavigationScreenProp } from '../../../mocks/navigation';

describe('Categories tests', () => {
  const addListener = () => true;
  const categories = [createCategory()];
  const selectedObservation = createObservation();
  const listCategories = jest.fn();
  const updateObservation = jest.fn();
  const clearSelectedObservation = jest.fn();
  const field = createField();
  const icons = {
    [createCategory().icon]: 'icon'
  };

  test('snapshot', () => {
    const tree = renderer
      .create(
        <Categories
          categories={categories}
          navigation={createNavigationScreenProp()}
          selectedObservation={selectedObservation}
          listCategories={listCategories}
          updateObservation={updateObservation}
          allFields={{ [field.id]: field }}
          updateFlow={false}
          clearSelectedObservation={clearSelectedObservation}
          icons={icons}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
