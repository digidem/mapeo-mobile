// @flow
import React from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  NetInfo
} from 'react-native';
import { NavigationActions, withNavigationFocus } from 'react-navigation';
import WifiIcon from 'react-native-vector-icons/MaterialIcons';
import SyncHeader from './SyncHeader';
import DeviceCell from './DeviceCell';
import SyncedModal from '../../Base/SyncedModal/SyncedModal';
import type { Device } from '../../../types/device';
import { MAPEO_BLUE, MEDIUM_BLUE } from '../../../lib/styles';
import I18n from 'react-native-i18n';

type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  devices: Device[],
  selectedDevice?: Device,
  syncAnnounced: boolean,
  syncedModalVisible: boolean
};

export type DispatchProps = {
  announceSync: () => void,
  listDevices: () => void,
  selectDevice: (device?: Device) => void,
  toggleDeviceSelect: (device: Device) => void,
  updateDeviceSync: (device: Device) => void,
  showSyncedModal: () => void,
  hideSyncedModal: () => void
};

type State = {
  wifi: boolean
};

if (I18n) {
  I18n.fallbacks = true;
  I18n.translations = {
    en: require('../../../translations/en'),
    es: require('../../../translations/es')
  };
}

class SyncView extends React.Component<
  Props & StateProps & DispatchProps,
  State
> {
  state = { wifi: false };

  componentDidMount() {
    const { announceSync, listDevices } = this.props;

    announceSync();
    listDevices();
    NetInfo.getConnectionInfo().then(connectionInfo => {
      if (connectionInfo.type === 'wifi') {
        this.setState({ wifi: true });
      }
    });
    NetInfo.addEventListener('connectionChange', this.handleConnectionChange);
  }

  componentWillUnmount() {
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleConnectionChange
    );
  }

  shouldComponentUpdate(
    nextProps: Props & StateProps & DispatchProps,
    nextState: State
  ) {
    if (nextProps.navigation.isFocused()) {
      return nextProps !== this.props || nextState !== this.state;
    }

    return false;
  }

  handleConnectionChange = connectionInfo => {
    if (connectionInfo.type === 'wifi') {
      this.setState({ wifi: true });
    } else {
      this.setState({ wifi: false });
    }
  };

  render() {
    const {
      devices,
      navigation,
      selectDevice,
      selectedDevice,
      toggleDeviceSelect,
      updateDeviceSync,
      hideSyncedModal,
      showSyncedModal,
      syncedModalVisible
    } = this.props;
    const { wifi } = this.state;

    let syncStopped = false;
    const noDevices = devices.length === 0 || !wifi;
    let headerDeviceText = noDevices
      ? I18n.t('sync.none')
      : I18n.t('sync.available');
    if (selectedDevice) {
      switch (selectedDevice.syncStatus) {
        case 'requested':
          headerDeviceText = I18n.t('sync.initiated');
          break;
        case 'syncing':
          headerDeviceText = I18n.t('sync.progress');
          break;
        case 'stopped':
          headerDeviceText = I18n.t('sync.stopped');
          syncStopped = true;
          break;
        case 'completed':
          headerDeviceText = 'Sync completed';
          break;
        default:
          headerDeviceText = I18n.t('sync.selected');
      }
    }

    const keyExtractor = (item, index) => item.id;

    const handleDevicePress = item => {
      const syncInProgress =
        item.syncStatus === 'requested' || item.syncStatus === 'syncing';
      const startSync = () => {
        updateDeviceSync({
          ...item,
          selected: true,
          syncStatus: 'replication-started'
        });
        setTimeout(() => {
          updateDeviceSync({
            ...item,
            selected: true,
            syncStatus: 'replication-progress'
          });
        }, 1000);
        setTimeout(() => {
          updateDeviceSync({
            ...item,
            selected: true,
            syncStatus: 'replication-complete'
          });
          toggleDeviceSelect(item);
          showSyncedModal();
        }, 4000);
      };
      if (selectedDevice) {
        updateDeviceSync({
          ...selectedDevice,
          selected: false,
          syncStatus: 'replication-stopped'
        });

        if (selectedDevice.id !== item.id) {
          startSync();
        }
      } else {
        startSync();
      }
    };
    const renderItem = ({ item }) => (
      <DeviceCell
        device={item}
        onPress={handleDevicePress}
        selectedDevice={selectedDevice}
        showSyncedModal={showSyncedModal}
      />
    );
    const closeSyncView = () => {
      if (selectedDevice) {
        selectDevice(undefined);
        toggleDeviceSelect(selectedDevice);
      }
      const { listDevices } = this.props;
      listDevices();
      navigation.goBack();
    };
    const handleModalContinue = () => {
      hideSyncedModal();
    };

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: MAPEO_BLUE
        }}
      >
        {noDevices ? (
          <View style={{ flex: 1 }}>
            <SyncHeader
              closeSyncView={closeSyncView}
              deviceText={headerDeviceText}
              syncStopped={syncStopped}
            />
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <View
                style={{
                  width: 200,
                  height: 200,
                  backgroundColor: MEDIUM_BLUE,
                  borderRadius: 100,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <WifiIcon name="wifi" size={180} color="white" />
              </View>
              <Text
                style={{
                  marginTop: 30,
                  color: 'white',
                  fontWeight: '700',
                  fontSize: 18,
                  textAlign: 'center'
                }}
              >
                {I18n.t('sync.check')}
              </Text>
            </View>
          </View>
        ) : (
          <View>
            <FlatList
              scrollEnabled
              ListHeaderComponent={
                <SyncHeader
                  closeSyncView={closeSyncView}
                  deviceText={headerDeviceText}
                  syncStopped={syncStopped}
                />
              }
              data={devices}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              style={{ width: Dimensions.get('window').width }}
            />
            <SyncedModal
              onContinue={handleModalContinue}
              visible={syncedModalVisible}
            />
          </View>
        )}
      </View>
    );
  }
}

export default withNavigationFocus(SyncView);
