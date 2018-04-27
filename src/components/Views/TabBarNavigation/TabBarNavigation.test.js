// @flow
import React from 'react';
import 'react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import TabBarNavigation from './TabBarNavigation';
import { createObservation } from '../../../mocks/observations';
import { createInitialStore } from '../../../lib/store';

jest.mock('../ObservationsView', () => () => null);
jest.mock('../MapView', () => () => null);
jest.mock('../CameraMainView', () => () => null);

describe('TabBarNavigation tests', () => {
  test('snapshots', () => {
    const observation = createObservation();
    const dispatch = jest.fn();
    const mockStore = configureStore();
    const state = {
      app: createInitialStore(),
      mainStack: []
    };

    const tree = renderer
      .create(
        <TabBarNavigation
          isFocused
          selectedObservation={observation}
          dispatch={dispatch}
          navigation={{ navigate: jest.fn() }}
        />
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
