// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ObservationDetailView from './ObservationDetailView';
import { createObservation } from '../../../mocks/observations';

describe('ObservationDetailView tests', () => {
  test('snapshot', () => {
    const observation = createObservation();
    const isFocused = () => true;
    const addListener = () => true;

    const tree = shallow(
      <ObservationDetailView
        navigation={{ isFocused, addListener }}
        selectedObservation={observation}
        clearSelectedObservation={jest.fn()}
        goBack={jest.fn()}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
