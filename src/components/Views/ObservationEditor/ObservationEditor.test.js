// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ObservationEditor from './ObservationEditor';
import { createObservation } from '../../../mocks/observations';

jest.mock('../../Base/CancelModal/CancelModal', () => () => null);
jest.mock('../../Base/ManualGPSModal', () => () => null);

describe('ObservationEditor tests', () => {
  const observation = createObservation();
  const isFocused = () => true;
  const addListener = () => true;

  test('snapshot', () => {
    const tree = renderer
      .create(
        <ObservationEditor
          navigation={{ isFocused, addListener }}
          selectedObservation={observation}
          updateObservation={jest.fn()}
          showCancelModal={jest.fn()}
          hideCancelModal={jest.fn()}
          clearSelectedObservation={jest.fn()}
          hideManualGPSModal={jest.fn()}
          showManualGPSModal={jest.fn()}
          saveObservation={jest.fn()}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
