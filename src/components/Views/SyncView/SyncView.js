// @flow
import React from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  View,
  FlatList,
  Dimensions,
  StyleSheet
} from 'react-native';
import { NavigationActions, withNavigationFocus } from 'react-navigation';
import SyncHeader from './SyncHeader';
import DeviceCell from './DeviceCell';
import type { Device } from '../../../types/device';
import { MAPEO_BLUE } from '../../../lib/styles';
import I18n from 'react-native-i18n';

type Props = {
  isFocused: boolean,
  navigation: NavigationActions
};

export type StateProps = {
  devices: Device[],
  selectedDevice: Device
};

export type DispatchProps = {
  listDevices: () => void,
  goBack: () => void,
  selectDevice: (device?: Device) => void,
  toggleDeviceSelect: (device: Device) => void,
  updateDeviceSync: (device: Device) => void
};

if (I18n) {
  I18n.fallbacks = true;
  I18n.translations = {
    en: require('../../../translations/en'),
    es: require('../../../translations/es')
  };
}

class SyncView extends React.Component<Props & StateProps & DispatchProps> {
  componentDidMount() {
    const { listDevices } = this.props;

    listDevices();
  }

  shouldComponentUpdate(nextProps: Props & StateProps & DispatchProps) {
    if (nextProps.isFocused) {
      return nextProps !== this.props;
    }

    return false;
  }

  render() {
    const {
      devices,
      goBack,
      selectDevice,
      selectedDevice,
      toggleDeviceSelect,
      updateDeviceSync
    } = this.props;
    console.log(this.props);

    let headerDeviceText = I18n.t('sync.available');
    if (selectedDevice) {
      headerDeviceText = I18n.t('sync.selected');

      if (selectedDevice.syncStatus === 'requested') {
        headerDeviceText = I18n.t('sync.initiated');
      } else if (selectedDevice.syncStatus === 'syncing') {
        headerDeviceText = I18n.t('sync.progress');
      }
    }

    const keyExtractor = (item, index) => item.id;
    const handleDevicePress = item => {
      toggleDeviceSelect({ ...item });
      if (selectedDevice) {
        toggleDeviceSelect({ ...selectedDevice });
      }
      selectDevice({
        ...item,
        selected: true,
        syncStatus: 'notStarted'
      });
    };
    const renderItem = ({ item }) => (
      <DeviceCell
        device={item}
        onPress={handleDevicePress}
        selectDevice={selectDevice}
        selectedDevice={selectedDevice}
        updateDeviceSync={updateDeviceSync}
      />
    );
    const closeSyncView = () => {
      if (selectedDevice) {
        selectDevice(undefined);
        toggleDeviceSelect({ ...selectedDevice });
        goBack();
      } else {
        goBack();
      }
    };

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: MAPEO_BLUE
        }}
      >
        <FlatList
          scrollEnabled
          ListHeaderComponent={
            <SyncHeader
              closeSyncView={closeSyncView}
              deviceText={headerDeviceText}
            />
          }
          data={devices}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={{ width: Dimensions.get('window').width }}
        />
      </View>
    );
  }
}

export default withNavigationFocus(SyncView);
