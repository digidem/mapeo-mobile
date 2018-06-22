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
          goToPhotoView={jest.fn()}
          goToObservationFields={jest.fn()}
          goToCameraView={jest.fn()}
          goToMainCameraView={jest.fn()}
          goToCategories={jest.fn()}
          goBack={jest.fn()}
          goToMapView={jest.fn()}
          showSavedModal={jest.fn()}
          showCancelModal={jest.fn()}
          hideCancelModal={jest.fn()}
          clearSelectedObservation={jest.fn()}
          hideManualGPSModal={jest.fn()}
          showManualGPSModal={jest.fn()}
          showSavedModal={jest.fn()}
          saveObservation={jest.fn()}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
