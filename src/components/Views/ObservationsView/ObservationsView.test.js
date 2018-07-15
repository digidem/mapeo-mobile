// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import { NavigationActions } from 'react-navigation';
import ObservationsView from './ObservationsView';
import { createObservation } from '../../../mocks/observations';
import { createNavigationScreenProp } from '../../../mocks/navigation';

jest.mock('./ObservationCell', () => 'mock-observation-cell');

describe('ObservationsView tests', () => {
  const closeRightDrawer = jest.fn();
  const observation = createObservation();
  const cases = [observation];

  beforeEach(() => {
    closeRightDrawer.mockReset();
  });

  test('snapshot', () => {
    const tree = renderer.create(
      <ObservationsView
        drawerOpened={true}
        observations={cases}
        categories={{}}
        icons={{}}
        selectObservation={jest.fn()}
        closeRightDrawer={closeRightDrawer}
        navigation={createNavigationScreenProp()}
        listCategories={jest.fn()}
        listObservations={jest.fn()}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
