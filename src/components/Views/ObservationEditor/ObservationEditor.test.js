// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ObservationEditor from './ObservationEditor';
import { createObservation } from '../../../mocks/observations';

describe('ObservationEditor tests', () => {
  const observation = createObservation();
  const isFocused = () => true;
  const addListener = () => true;

  test('snapshot', () => {
    const tree = renderer.create(
      <ObservationEditor
        navigation={{ isFocused, addListener }}
        selectedObservation={observation}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
