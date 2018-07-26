// @flow
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer';
import SyncView from './SyncView';
import { createDevice } from '../../../mocks/devices';
import { createNavigationScreenProp } from '../../../mocks/navigation';

jest.mock('./DeviceCell', () => 'mock-device-cell');
jest.useFakeTimers();

describe('SyncView tests', () => {
  const device = createDevice();
  const devices = [device];
  const announceSync = jest.fn();
  const startSync = jest.fn();
  const selectDevice = jest.fn();
  const toggleDeviceSelect = jest.fn();
  const updateDeviceSync = jest.fn();
  const showSyncedModal = jest.fn();
  const hideSyncedModal = jest.fn();
  const deviceList = jest.fn();

  test('snapshot', () => {
    const tree = renderer.create(
      <SyncView
        announceSync={announceSync}
        devices={devices}
        syncedModalVisible={false}
        navigation={createNavigationScreenProp()}
        startSync={startSync}
        selectDevice={selectDevice}
        toggleDeviceSelect={toggleDeviceSelect}
        updateDeviceSync={updateDeviceSync}
        deviceList={deviceList}
        showSyncedModal={showSyncedModal}
        hideSyncedModal={hideSyncedModal}
      />
    );

    expect(tree).toMatchSnapshot();
  });
});
