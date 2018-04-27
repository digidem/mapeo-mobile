// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import Position from './Position';
import { createObservation } from '../../../mocks/observations';

describe('Position tests', () => {
  test('snapshots', () => {
    const observation = createObservation();
    const isFocused = () => true;
    const addListener = () => true;

    const tree = renderer.create(
      <Position
        navigation={{ isFocused, addListener }}
        selectedObservation={observation}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
