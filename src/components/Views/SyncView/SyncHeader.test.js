// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SyncHeader from './SyncHeader';

describe('SyncHeader tests', () => {
  const closeSyncView = jest.fn();

  test('snapshot with available devices', () => {
    const tree = renderer.create(
      <SyncHeader
        closeSyncView={closeSyncView}
        deviceText="Available Devices"
      />
    );
    expect(tree).toMatchSnapshot();
  });

  test('snapshot with device selected', () => {
    const tree = renderer.create(
      <SyncHeader closeSyncView={closeSyncView} deviceText="Device Selected" />
    );
    expect(tree).toMatchSnapshot();
  });
});
