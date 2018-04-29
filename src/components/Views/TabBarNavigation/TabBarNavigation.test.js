// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import TabBarNavigation from './TabBarNavigation';

jest.mock('../ObservationsView', () => () => null);
jest.mock('../MapView', () => () => null);
jest.mock('../CameraMainView', () => () => null);
jest.mock('./SavedModal', () => () => null);

describe('TabBarNavigation tests', () => {
  test('snapshots', () => {
    const props = [
      { isFocused: true, showSavedModal: true },
      { isFocused: true, showSavedModal: false },
      { isFocused: false, showSavedModal: true },
      { isFocused: false, showSavedModal: false }
    ];

    let tree;
    props.forEach(p => {
      tree = renderer
        .create(
          <TabBarNavigation
            isFocused={p.isFocused}
            showSavedModal={p.showSavedModal}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
