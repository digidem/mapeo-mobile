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
  devices: Device[]
};

export type DispatchProps = {
  announceSync: () => any,
  unannounceSync: () => any,
  clearSyncTarget: () => any,
  sync: (device: Device) => any
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
  focusListener: any;
  blurListener: any;

  componentDidMount() {
    const { navigation } = this.props;

    this.startSyncIntervals()

    NetInfo.addEventListener('connectionChange', this.handleConnectionChange);

    this.focusListener = navigation.addListener('willFocus', this.handleFocus.bind(this));
    this.blurListener = navigation.addListener('willBlur', this.handleBlur.bind(this));
  }

  startSyncIntervals () {
    const { announceSync } = this.props;
    if (this.interval) return

    this.interval = setInterval(() => {
      if (this.interval) {
        announceSync();
      }
    }, 3000)
  }

  stopSyncIntervals () {
    const { unannounceSync } = this.props;
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }

    unannounceSync();
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
    // TODO: re-announce once we aren't announcing every three seconds 
  };

  handleDevicePress = (item: Device) => {
    const { sync } = this.props;
    const syncInProgress =
      item.syncStatus === 'replication-started' ||
      item.syncStatus === 'replication-progress' ||
      item.syncStatus === 'replication-complete';

    if (!syncInProgress) {
      sync(item);
    }
  };

  renderItem = ({ item }: { item: Device }) => {
    return (
      <DeviceCell
        device={item}
        onPress={this.handleDevicePress}
      />
    );
  };

  handleBack = () => {
    const { unannounceSync, navigation } = this.props;
    this.stopSyncIntervals();

    navigation.goBack();
  };

  render() {
    const { devices, navigation, sync } = this.props;

    let syncStopped = false;
    const noDevices: boolean = devices.length === 0;

    let stuffHappening: ?Device = devices.find(device => device.syncStatus !== null)
    switch (stuffHappening && stuffHappening.syncStatus) {
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
        progressText = noDevices
          ? I18n.t('sync.searching')
          : I18n.t('sync.available');
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
