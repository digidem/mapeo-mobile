// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import { NavigationActions } from 'react-navigation';
import ObservationsView from './ObservationsView';
import { createObservation } from '../../../mocks/observations';

describe('ObservationsView tests', () => {
  const closeRightDrawer = jest.fn();
  const observation = createObservation();
  const cases = [observation];
  jest.mock('./ObservationCell', () => 'mock-observation-cell');

  beforeEach(() => {
    closeRightDrawer.mockReset();
  });

  test('snapshot', () => {
    const tree = renderer.create(
      <ObservationsView
        drawerOpened
        selectObservation={jest.fn()}
        goToObservationDetail={jest.fn()}
        goToSettings={jest.fn()}
        closeRightDrawer={closeRightDrawer}
        navigation={NavigationActions}
        observations={cases}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
