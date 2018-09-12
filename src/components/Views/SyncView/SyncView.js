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
  syncTarget?: Device
};

export type DispatchProps = {
  announceSync: () => void,
  unannounceSync: () => void,
  setSyncTarget: (device?: Device) => void,
  sync: (device: Device) => void
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
    const { announceSync, navigation } = this.props;

    announceSync();

    NetInfo.getConnectionInfo().then(connectionInfo => {
      if (connectionInfo.type === 'wifi') {
        this.setState({ wifi: true });
      }
    });
    NetInfo.addEventListener('connectionChange', this.handleConnectionChange);

    this.focusListener = navigation.addListener('willFocus', this.handleFocus);
    this.blurListener = navigation.addListener('willBlur', this.handleBlur);
  }

  componentWillUnmount() {
    const { unannounceSync } = this.props;

    unannounceSync();
    this.focusListener.remove();
    this.blurListener.remove();

    NetInfo.removeEventListener(
      'connectionChange',
      this.handleConnectionChange
    );
  }

  handleFocus = () => {
    const { announceSync } = this.props;

    announceSync();
  };

  handleBlur = () => {
    const { unannounceSync, syncTarget, setSyncTarget } = this.props;

    // on screen blur, unannounce and clear selected device
    unannounceSync();
    if (syncTarget) {
      setSyncTarget(undefined);
    }
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
    const syncInProgress =
      item.syncStatus === 'requested' || item.syncStatus === 'syncing';

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
        selected={!!syncTarget && item.id === syncTarget.id}
      />
    );
  };

  render() {
    const { devices, navigation, syncTarget, setSyncTarget, sync } = this.props;
    const { wifi } = this.state;

    let syncStopped = false;
    const noDevices = devices.length === 0 || !wifi;
    let progressText = noDevices
      ? I18n.t('sync.none')
      : I18n.t('sync.available');
    if (syncTarget) {
      switch (syncTarget.syncStatus) {
        case 'requested':
          progressText = I18n.t('sync.initiated');
          break;
        case 'syncing':
          progressText = I18n.t('sync.progress');
          break;
        case 'stopped':
          progressText = I18n.t('sync.stopped');
          syncStopped = true;
          break;
        case 'completed':
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
              back={navigation.goBack}
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
