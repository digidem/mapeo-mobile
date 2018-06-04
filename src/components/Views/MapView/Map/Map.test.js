// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import Map from './Map';
import { createObservation } from '../../../../mocks/observations';

describe('MapView tests', () => {
  test('snapshots', () => {
    const observation = createObservation();
    const isFocused = () => true;
    const addListener = () => true;

    let tree;
    tree = shallow(
      <Map
        navigation={{ isFocused, addListener }}
        selectedObservation={observation}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
