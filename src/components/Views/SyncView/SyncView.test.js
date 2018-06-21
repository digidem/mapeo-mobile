// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SyncView from './SyncView';
import { createDevice } from '../../../mocks/devices';

describe('SyncView tests', () => {
  const device = createDevice();
  const cases = [device];
  const isFocused = () => true;
  const addListener = () => true;
  const listDevices = jest.fn();
  jest.mock('./DeviceCell', () => 'mock-device-cell');

  test('snapshot', () => {
    const tree = renderer.create(
      <SyncView
        devices={cases}
        navigation={{ addListener, isFocused }}
        listDevices={listDevices}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
