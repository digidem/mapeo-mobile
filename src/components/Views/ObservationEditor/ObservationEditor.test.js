// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ObservationEditor from './ObservationEditor';
import { createObservation } from '../../../mocks/observations';
import { createNavigationScreenProp } from '../../../mocks/navigation';
import { resourceSuccess } from '../../../lib/resource';
import { createCategory } from '../../../mocks/categories';
import { createGPSState } from '../../../mocks/gps';

jest.mock('../../Base/CancelModal/CancelModal', () => () => null);
jest.mock('../../Base/ManualGPSModal', () => () => null);
jest.mock('../../../ducks/gps', () => ({
  HIGH_ACCURACY: 'HIGH_ACCURACY'
}));

describe('ObservationEditor tests', () => {
  const observation = createObservation();

  test('snapshot', () => {
    const tree = renderer
      .create(
        <ObservationEditor
          navigation={createNavigationScreenProp()}
          observations={[]}
          observationSource=""
          cancelModalVisible={false}
          gps={resourceSuccess(createGPSState())}
          manualGPSModalVisible={false}
          gpsFormat=""
          icons={{}}
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
