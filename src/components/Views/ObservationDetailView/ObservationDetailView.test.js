// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ObservationDetailView from './ObservationDetailView';
import { createObservation } from '../../../mocks/observations';

describe.only('ObservationDetailView tests', () => {
  test('snapshots', () => {
    const observation = createObservation();
    const isFocused = () => true;
    const addListener = () => true;

    let tree;
    tree = shallow(
      <ObservationDetailView
        navigation={{ isFocused, addListener }}
        selectedObservation={observation}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
