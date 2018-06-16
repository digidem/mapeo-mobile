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
    borderBottomColor: MEDIUM_BLUE,
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
    alignItems: 'flex-start'
  },
  syncArrow: {
    alignSelf: 'center',
    justifyContent: 'center'
  },
  syncButtonContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 20,
    justifyContent: 'center',
    alignItems: 'center'
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
    props.onPress(props.device);
  };
  const handleSyncUpdate = () => {
    const syncInProgress =
      props.device.syncStatus === 'requested' ||
      props.device.syncStatus === 'syncing';

    if (syncInProgress) {
      props.updateDeviceSync({
        ...props.device,
        syncStatus: 'stopped'
      });
    } else {
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
      setTimeout(() => {
        props.updateDeviceSync({
          ...props.device,
          syncStatus: 'completed'
        });
      }, 4000);
    }
  };

  let syncStatusText = I18n.t('sync.via_wifi');
  if (props.device.syncStatus === 'requested') {
    syncStatusText = I18n.t('sync.requested');
  } else if (props.device.syncStatus === 'syncing') {
    syncStatusText = I18n.t('sync.syncing');
  }

  const syncInProgress =
    (props.device.selected && props.device.syncStatus === 'requested') ||
    (props.device.selected && props.device.syncStatus === 'syncing');

  return (
    <TouchableOpacity onPress={handlePress}>
      <View
        style={[
          styles.cellContainer,
          { backgroundColor: props.device.selected ? MEDIUM_BLUE : MAPEO_BLUE }
        ]}
      >
        <View style={styles.deviceTextContainer}>
          <Text style={styles.deviceName}>{props.device.name}</Text>
          <Text style={styles.syncStatus}>{syncStatusText}</Text>
        </View>
        {!syncInProgress && (
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
        {syncInProgress && (
          <TouchableOpacity
            style={styles.syncButtonContainer}
            onPress={handleSyncUpdate}
          >
            <View
              style={{
                position: 'absolute',
                top: 13,
                bottom: 0,
                right: 0,
                left: 13
              }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: 'white'
                }}
              />
            </View>
            <ActivityIndicator size="large" color={VERY_LIGHT_BLUE} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default DeviceCell;
