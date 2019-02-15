// @flow
import React from 'react';
import {
  Dimensions,
  FlatList,
  NetInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
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
  syncTarget?: string
};

export type DispatchProps = {
  announceSync: () => any,
  unannounceSync: () => any,
  clearSyncTarget: () => any,
  sync: (device: Device) => any
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
  focusListener: any;
  blurListener: any;

  componentDidMount() {
    const { navigation } = this.props;

    this.startSyncIntervals()

    NetInfo.getConnectionInfo().then(connectionInfo => {
      if (connectionInfo.type === 'wifi') {
        this.setState({ wifi: true });
      }
    });
    NetInfo.addEventListener('connectionChange', this.handleConnectionChange);

    this.focusListener = navigation.addListener('willFocus', this.handleFocus.bind(this));
    this.blurListener = navigation.addListener('willBlur', this.handleBlur.bind(this));
  }

  startSyncIntervals () {
    const { announceSync } = this.props;
    if (this.interval) return

    this.interval = setInterval(() => {
      if (this.interval) announceSync();
    }, 3000)
  }

  stopSyncIntervals () {
    const { unannounceSync, syncTarget, clearSyncTarget } = this.props;
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }

    unannounceSync();
    if (syncTarget) {
      clearSyncTarget();
    }
  }

  componentWillUnmount() {
    this.stopSyncIntervals();
    this.focusListener.remove();
    this.blurListener.remove();

    NetInfo.removeEventListener(
      'connectionChange',
      this.handleConnectionChange
    );
  }

  handleFocus = () => {
    this.startSyncIntervals();
  };

  handleBlur = () => {
    this.stopSyncIntervals();
  };

  handleConnectionChange = (connectionInfo: Object) => {
    if (connectionInfo.type === 'wifi') {
      this.setState({ wifi: true });
    } else {
      this.setState({ wifi: false });
    }
  };

  handleDevicePress = (item: Device) => {
    const { sync } = this.props;
    console.log(item)
    const syncInProgress =
      item.syncStatus === 'replication-started' ||
      item.syncStatus === 'replication-progress';

    if (!syncInProgress) {
      sync(item);
    }
  };

  renderItem = ({ item }: { item: Device }) => {
    const { syncTarget } = this.props;

    return (
      <DeviceCell
        device={item}
        onPress={this.handleDevicePress}
        selected={!!syncTarget && item.id === syncTarget}
      />
    );
  };

  handleBack = () => {
    const { unannounceSync, navigation } = this.props;
    console.log('clicked back');
    this.stopSyncIntervals();

    navigation.goBack();
  };

  render() {
    const { devices, navigation, syncTarget, sync } = this.props;
    const { wifi } = this.state;

    let syncStopped = false;
    const noDevices: boolean = devices.length === 0 || !wifi;

    let progressText: string = noDevices
      ? I18n.t('sync.none')
      : I18n.t('sync.available');
    const selectedDevice: ?Device = syncTarget
      ? devices.find(device => device.id === syncTarget)
      : undefined;

    if (selectedDevice) {
      console.log(selectedDevice.syncStatus)
      switch (selectedDevice.syncStatus) {
        case 'replication-started':
          progressText = I18n.t('sync.initiated');
          break;
        case 'replication-progress':
          progressText = I18n.t('sync.progress');
          break;
        case 'replication-error':
          progressText = I18n.t('sync.stopped');
          syncStopped = true;
          break;
        case 'replication-complete':
          progressText = I18n.t('sync.completed');
          break;
        default:
          progressText = I18n.t('sync.selected');
      }
    }

    const keyExtractor = (item, index) => item.id;

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
              back={this.handleBack}
              progressText={progressText}
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
                  back={navigation.goBack}
                  progressText={progressText}
                  syncStopped={syncStopped}
                />
              }
              data={devices}
              keyExtractor={keyExtractor}
              renderItem={this.renderItem}
              style={{ width: Dimensions.get('window').width }}
            />
          </View>
        )}
      </View>
    );
  }
}

export default SyncView;
