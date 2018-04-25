// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import TabBarNavigation from './TabBarNavigation';
import { createObservation } from '../../../mocks/observations';

describe('TabBarNavigation tests', () => {
  test('snapshots', () => {
    const observation = createObservation();
    const isFocused = () => true;
    const addListener = () => true;

    let tree;
    tree = shallow(
      <TabBarNavigation navigation={{ isFocused, addListener }} />
    ).dive();
    expect(tree).toMatchSnapshot();
  });
});
