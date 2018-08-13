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
import type { NavigationScreenProp } from 'react-navigation';
import WifiIcon from 'react-native-vector-icons/MaterialIcons';
import SyncHeader from './SyncHeader';
import DeviceCell from './DeviceCell';
import SyncedModal from '../../Base/SyncedModal/SyncedModal';
import type { Device } from '../../../types/device';
import { MAPEO_BLUE, MEDIUM_BLUE } from '../../../lib/styles';
import I18n from 'react-native-i18n';

type Props = {
  navigation: NavigationScreenProp<*>
};

export type StateProps = {
  devices: Device[],
  selectedDevice?: Device,
  syncedModalVisible: boolean
};

export type DispatchProps = {
  announceSync: () => void,
  startSync: (device: Device) => void,
  selectDevice: (device?: Device) => void,
  toggleDeviceSelect: (device: Device) => void,
  updateDeviceSync: (device: Device) => void,
  deviceList: () => void,
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
  interval: any;

  componentDidMount() {
    const { deviceList, announceSync } = this.props;

    this.interval = setInterval(function() {
      deviceList();
      announceSync();
    }, 1000);

    NetInfo.getConnectionInfo().then(connectionInfo => {
      if (connectionInfo.type === 'wifi') {
        this.setState({ wifi: true });
      }
    });
    NetInfo.addEventListener('connectionChange', this.handleConnectionChange);
  }

  componentWillReceiveProps(nextProps: Props & StateProps & DispatchProps) {
    const { announceSync, navigation } = nextProps;

    if (navigation.isFocused() && !this.props.navigation.isFocused()) {
      announceSync();
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }

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

  handleConnectionChange = (connectionInfo: Object) => {
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
      syncedModalVisible,
      startSync
    } = this.props;
    const { wifi } = this.state;

    let syncStopped = false;
    const noDevices = devices.length === 0 || !wifi;
    let headerDeviceText = noDevices
      ? I18n.t('sync.none')
      : I18n.t('sync.available');
    if (selectedDevice) {
      switch (selectedDevice.syncStatus) {
        case 'replication-started':
          headerDeviceText = I18n.t('sync.initiated');
          break;
        case 'replication-progress':
          headerDeviceText = I18n.t('sync.progress');
          break;
        case 'replication-error':
          headerDeviceText = I18n.t('sync.stopped');
          syncStopped = true;
          break;
        case 'replication-complete':
          headerDeviceText = I18n.t('sync.completed');
          break;
        default:
          headerDeviceText = I18n.t('sync.selected');
      }
    }

    const keyExtractor = (item, index) => item.id;

    const handleDevicePress = item => {
      const { selectDevice } = this.props;
      const syncInProgress =
        item.syncStatus === 'requested' || item.syncStatus === 'syncing';

      selectDevice(item);
      startSync(item);
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

export default SyncView;
