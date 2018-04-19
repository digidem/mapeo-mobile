// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import ObservationHeader from './ObservationHeader';

describe('ObservationHeader tests', () => {
  const closeRightDrawer = jest.fn();

  beforeEach(() => {
    closeRightDrawer.mockReset();
  });

  test('snapshots', () => {
    let tree;
    tree = renderer.create(
      <ObservationHeader closeRightDrawer={closeRightDrawer} showSyncTip />
    );
    expect(tree).toMatchSnapshot();
  });
});
