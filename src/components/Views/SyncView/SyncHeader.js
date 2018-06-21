// @flow

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import CloseIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import I18n from 'react-native-i18n';
import type { Device } from '../../../types/device';
import {
  DARK_BLUE,
  DARK_MAGENTA,
  MAPEO_BLUE,
  WHITE
} from '../../../lib/styles';

type Props = {
  closeSyncView: () => void,
  deviceText: string,
  syncStopped: boolean
};

const styles = StyleSheet.create({
  closeIcon: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 15
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 65,
    paddingHorizontal: 15,
    backgroundColor: MAPEO_BLUE
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: DARK_BLUE
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: WHITE,
    alignSelf: 'flex-start'
  }
});

if (I18n) {
  I18n.fallbacks = true;
  I18n.translations = {
    en: require('../../../translations/en'),
    es: require('../../../translations/es')
  };
}

const SyncHeader = (props: Props) => (
  <View style={{ flexDirection: 'column' }}>
    <View style={styles.header}>
      <TouchableOpacity onPress={props.closeSyncView} style={styles.closeIcon}>
        <CloseIcon color={WHITE} name="close" size={30} />
      </TouchableOpacity>
      <View style={{ flexDirection: 'column' }}>
        <Text style={styles.headerText}>{I18n.t('sync.sync')}</Text>
      </View>
    </View>
    <View
      style={[
        styles.headerBottom,
        props.syncStopped ? { backgroundColor: DARK_MAGENTA } : null
      ]}
    >
      <Text style={{ fontWeight: '700', fontSize: 12, color: WHITE }}>
        {props.deviceText}
      </Text>
    </View>
  </View>
);

export default SyncHeader;
