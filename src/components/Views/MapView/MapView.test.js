// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import MapView from './MapView';
import { createObservation } from '../../../mocks/observations';

describe('MapView tests', () => {
  test('snapshots', () => {
    const observation = createObservation();
    const isFocused = () => true;
    const addListener = () => true;

    let tree;
    tree = shallow(
      <MapView
        navigation={{ isFocused, addListener }}
        selectedObservation={observation}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
