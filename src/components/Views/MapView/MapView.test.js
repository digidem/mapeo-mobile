// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import MapView from './MapView';
import { createObservation } from '../../../mocks/observations';

jest.mock('../ObservationsView', () => () => null);
jest.mock('./Map', () => () => null);
jest.mock('../../Base/SavedModal', () => () => null);
jest.mock('backoff-rxjs', () => ({ retryBackoff: () => null }));

describe('MapView tests', () => {
  test('snapshots', () => {
    const props = [{ showSavedModal: true }, { showSavedModal: false }];

    let tree;
    props.forEach(p => {
      tree = renderer.create(
        <MapView
          showSavedModal={p.showSavedModal}
          observations={[createObservation()]}
          listObservations={jest.fn()}
          onDrawerOpen={jest.fn()}
          onDrawerClose={jest.fn()}
        />
      );
      expect(tree).toMatchSnapshot();
    });
  });
});
