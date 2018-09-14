// @flow
import { connect } from 'react-redux';
import { values } from 'lodash';
import type { Dispatch } from 'redux';
import type { StoreState } from '../../../types/redux';
import type { Device } from '../../../types/device';
import {
  deviceList,
  deviceSelect,
  deviceSyncUpdate
} from '../../../ducks/devices';
import { syncAnnounce, syncStart, syncUnannounce } from '../../../ducks/sync';
import SyncView from './SyncView';
import type { StateProps, DispatchProps } from './SyncView';

function mapStateToProps(state: StoreState): StateProps {
  return {
    devices: values(state.devices),
    syncTarget: state.selectedDevice
  };
}

function mapDispatchToProps(dispatch: Dispatch<*>): DispatchProps {
  return {
    announceSync: () => {
      dispatch(syncAnnounce());
      dispatch(deviceList());
    },
    unannounceSync: () => dispatch(syncUnannounce()),
    setSyncTarget: device => dispatch(deviceSelect(device)),
    sync: device => dispatch(syncStart(device))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SyncView);
