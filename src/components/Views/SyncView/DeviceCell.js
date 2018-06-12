// @flow

import React from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { Device } from '../../../types/device';
import {
  DARK_BLUE,
  DARK_MANGO,
  MANGO,
  MAPEO_BLUE,
  MEDIUM_BLUE,
  VERY_LIGHT_BLUE
} from '../../../lib/styles';

type Props = {
  device: Device,
  onPress: (i: Device) => void,
  selectDevice: (device: Device) => void,
  selectedDevice?: Device,
  updateDeviceSync: (device: Device) => void
};

const styles = StyleSheet.create({
  cellContainer: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: DARK_BLUE,
    borderBottomWidth: 1,
    width: Dimensions.get('window').width,
    paddingHorizontal: 20
  },
  deviceName: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18
  },
  deviceTextContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 30
  },
  radioButtonOuterCircle: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -15
  },
  radioButtonInnerCircle: {
    alignSelf: 'center',
    height: 15,
    width: 15,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  syncArrow: {
    alignSelf: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-45deg' }]
  },
  syncButtonContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 20
  },
  syncButtonInnerCircle: {
    width: 25,
    height: 25,
    borderRadius: 50,
    backgroundColor: MANGO
  },
  syncButtonOuterCircle: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: DARK_MANGO,
    justifyContent: 'center',
    alignItems: 'center'
  },
  syncStatus: {
    color: 'white',
    fontWeight: '400',
    fontSize: 12
  }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

const DeviceCell = (props: Props) => {
  const handlePress = () => {
    if (props.selectedDevice) {
      props.updateDeviceSync({
        ...props.selectedDevice,
        syncStatus: 'notStarted'
      });
    }
    props.onPress(props.device);
  };
  const handleSyncUpdate = () => {
    props.updateDeviceSync({
      ...props.device,
      syncStatus: 'requested'
    });
    setTimeout(() => {
      props.updateDeviceSync({
        ...props.device,
        syncStatus: 'syncing'
      });
    }, 1000);
  };

  let syncStatusText = I18n.t('sync.via_wifi');
  if (props.device.syncStatus === 'requested') {
    syncStatusText = I18n.t('sync.requested');
  } else if (props.device.syncStatus === 'syncing') {
    syncStatusText = I18n.t('sync.syncing');
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={[
          styles.cellContainer,
          { backgroundColor: props.device.selected ? MEDIUM_BLUE : MAPEO_BLUE }
        ]}
      >
        <View style={styles.radioButtonOuterCircle}>
          <View
            style={[
              styles.radioButtonInnerCircle,
              { backgroundColor: props.device.selected ? 'black' : MAPEO_BLUE }
            ]}
          />
        </View>
        <View style={styles.deviceTextContainer}>
          <Text style={styles.deviceName}>{props.device.name}</Text>
          <Text style={styles.syncStatus}>{syncStatusText}</Text>
        </View>
        {props.device.selected &&
          props.device.syncStatus === 'notStarted' && (
            <TouchableOpacity
              style={styles.syncButtonContainer}
              onPress={handleSyncUpdate}
            >
              <View style={styles.syncButtonOuterCircle}>
                <View style={styles.syncButtonInnerCircle}>
                  <Icon
                    color="white"
                    name="arrow-forward"
                    size={23}
                    style={styles.syncArrow}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        {props.device.selected &&
          props.device.syncStatus !== 'notStarted' && (
            <View style={styles.syncButtonContainer}>
              <ActivityIndicator size="large" color={VERY_LIGHT_BLUE} />
            </View>
          )}
      </View>
    </TouchableOpacity>
  );
};

export default DeviceCell;
