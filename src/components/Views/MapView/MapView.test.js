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
    const observation = createObservation();
    const observations = {
      [observation.id]: observation
    };
    const props = [
      {
        showSavedModal: true,
        observations,
        selectedObservation: undefined,
        gps: undefined,
        selectedStyle: undefined
      },
      {
        showSavedModal: false,
        observations,
        selectedObservation: undefined,
        gps: undefined,
        selectedStyle: undefined
      },
      {
        showSavedModal: true,
        observations,
        selectedObservation: observation,
        gps: undefined,
        selectedStyle: undefined
      },
      {
        showSavedModal: false,
        observations,
        selectedObservation: observation,
        gps: undefined,
        selectedStyle: undefined
      }
    ];

    let tree;
    props.forEach(p => {
      tree = renderer.create(
        <MapView
          showSavedModal={p.showSavedModal}
          observations={p.observations}
          selectedObservation={p.selectedObservation}
          gps={p.gps}
          selectedStyle={p.selectedStyle}
          navigation={createNavigationScreenProp()}
          onDrawerOpen={jest.fn()}
          onDrawerClose={jest.fn()}
          listObservations={jest.fn()}
        />
      );
      expect(tree).toMatchSnapshot();
    });
  });
});
