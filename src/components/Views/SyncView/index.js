// @flow

import { connect } from 'react-redux';
import { values } from 'lodash';
import type { Dispatch } from 'redux';
import { StoreState } from '../../../types/redux';
import {
  deviceList,
  deviceSelect,
  deviceToggleSelect,
  deviceSyncUpdate
} from '../../../ducks/devices';
import { modalShow, modalHide } from '../../../ducks/modals';
import SyncView from './SyncView';
import type { StateProps, DispatchProps } from './SyncView';

function mapStateToProps(state: StoreState): StateProps {
  return {
    devices: values(state.app.devices),
    selectedDevice: state.app.selectedDevice,
    syncedModalVisible: state.app.modals.synced
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    listDevices: () => dispatch(deviceList('')),
    selectDevice: device => dispatch(deviceSelect(device)),
    toggleDeviceSelect: device => dispatch(deviceToggleSelect(device)),
    updateDeviceSync: device => {
      dispatch(deviceSyncUpdate(device));
      dispatch(deviceSelect(device));
    },
    showSyncedModal: () => dispatch(modalShow('synced')),
    hideSyncedModal: () => dispatch(modalHide('synced'))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SyncView);
