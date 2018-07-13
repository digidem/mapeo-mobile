// @flow
import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import Map from './Map';
import { createObservation } from '../../../../mocks/observations';

describe('MapView tests', () => {
  test('snapshots', () => {
    const observation = createObservation();
    const isFocused = () => true;
    const addListener = () => true;
    const listObservations = jest.fn();
    const createObservationMock = jest.fn();
    const updateObservation = jest.fn();
    const selectObservation = jest.fn();
    const updateObservationSource = jest.fn();
    const listStyles = jest.fn();

    let tree;
    tree = shallow(
      <Map
        observations={{}}
        navigation={{ isFocused, addListener }}
        selectedObservation={observation}
        listObservations={listObservations}
        createObservation={createObservationMock}
        updateObservation={updateObservation}
        selectObservation={selectObservation}
        updateObservationSource={updateObservationSource}
        listStyles={listStyles}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
