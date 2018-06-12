// @flow

import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { values } from 'lodash';
import type { Dispatch } from 'redux';
import { StoreState } from '../../../types/redux';
import {
  deviceList,
  deviceSelect,
  deviceToggleSelect
} from '../../../ducks/devices';
import SyncView from './SyncView';
import type { StateProps, DispatchProps } from './SyncView';

function mapStateToProps(state: StoreState): StateProps {
  return {
    devices: values(state.app.devices),
    selectedDevice: state.app.selectedDevice
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    goBack: () => dispatch(NavigationActions.back()),
    listDevices: () => dispatch(deviceList('')),
    selectDevice: device => dispatch(deviceSelect(device)),
    toggleDeviceSelect: device => dispatch(deviceToggleSelect(device))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SyncView);
