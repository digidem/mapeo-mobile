// @flow
import React from 'react';
import 'react-native';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import ObservationDetailView from './ObservationDetailView';
import { createObservation } from '../../../mocks/observations';
import { createNavigationScreenProp } from '../../../mocks/navigation';

describe('ObservationDetailView tests', () => {
  test('snapshot', () => {
    const observation = createObservation();

    const tree = shallow(
      <ObservationDetailView
        navigation={createNavigationScreenProp()}
        selectedObservation={observation}
        categories={{}}
        gpsFormat="gps"
        icons={{}}
        clearSelectedObservation={jest.fn()}
        updateObservation={jest.fn()}
        updateObservationSource={jest.fn()}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
