// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import MapView from './MapView';
import { createObservation } from '../../../mocks/observations';
import { createNavigationScreenProp } from '../../../mocks/navigation';

jest.mock('../ObservationsView', () => () => null);
jest.mock('./Map', () => () => null);
jest.mock('../../Base/SavedModal', () => () => null);
jest.mock('backoff-rxjs', () => ({ retryBackoff: () => null }));

describe('MapView tests', () => {
  test('snapshots', () => {
    let tree;
    tree = renderer.create(
      <MapView
        navigation={createNavigationScreenProp()}
        onDrawerOpen={jest.fn()}
        onDrawerClose={jest.fn()}
        listObservations={jest.fn()}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
