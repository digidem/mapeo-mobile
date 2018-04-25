// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import Categories from './Categories';
import { categoryList } from '../../../ducks/categories';
import { createObservation } from '../../../mocks/observations';
import { createCategory } from '../../../mocks/categories';

describe('Categories tests', () => {
  const isFocused = () => true;
  const addListener = () => true;
  const categories = [createCategory()];
  const selectedObservation = createObservation();
  jest.mock(`react-native-camera`, () => {
    const React = require('React');
  });

  test('snapshots', () => {
    let tree;
    tree = shallow(
      <Categories
        categories={categories}
        selectedObservation={selectedObservation}
        navigation={{ isFocused, addListener }}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
