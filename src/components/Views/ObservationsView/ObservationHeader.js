// @flow
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import LeftChevron from 'react-native-vector-icons/Feather';
import SyncIcon from 'react-native-vector-icons/FontAwesome';
import SettingsIcon from 'react-native-vector-icons/MaterialIcons';
import I18n from 'react-native-i18n';
import {
  DARK_MANGO,
  LIGHT_GREY,
  MANGO,
  MAPEO_BLUE,
  WHITE
} from '../../../lib/styles';

type Props = {
  closeRightDrawer: Function,
  goToSyncView: Function,
  onSettingsPress: Function
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  closeDrawerButton: {
    backgroundColor: 'transparent'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 65,
    paddingHorizontal: 15,
    backgroundColor: 'white'
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#f7f7f7',
    borderColor: LIGHT_GREY,
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  leftChevron: {
    justifyContent: 'center'
  },
  syncButtonInnerCircle: {
    alignSelf: 'center',
    backgroundColor: MANGO,
    height: 30,
    width: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  syncButtonOuterCircle: {
    width: 35,
    height: 35,
    backgroundColor: DARK_MANGO,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  syncTipContainer: {
    zIndex: 5,
    position: 'absolute',
    top: 50,
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: 'black',
    shadowRadius: 100,
    shadowOpacity: 6,
    shadowOffset: { width: 0, height: 100 },
    elevation: 3
  }
});

if (I18n) {
  I18n.fallbacks = true;
  I18n.translations = {
    en: require('../../../translations/en'),
    es: require('../../../translations/es')
  };
}

const ObservationHeader = (props: Props) => (
  <View
    style={{
      flexDirection: 'column'
    }}
  >
    <View style={styles.header}>
      <TouchableOpacity
        onPress={props.closeRightDrawer}
        style={styles.closeDrawerButton}
      >
        <LeftChevron color="#a5a5a4" name="chevron-left" size={30} />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'column'
        }}
      >
        <TouchableOpacity
          style={styles.syncButtonOuterCircle}
          onPress={props.goToSyncView}
        >
          <View style={styles.syncButtonInnerCircle}>
            <SyncIcon
              color={WHITE}
              name="bolt"
              size={20}
              style={{ transform: [{ rotate: '15deg' }] }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={props.onSettingsPress}>
        <SettingsIcon color="#a5a5a4" name="settings" size={30} />
      </TouchableOpacity>
    </View>
    <View style={styles.headerBottom}>
      <Text style={{ fontWeight: '700', fontSize: 12, color: 'black' }}>
        {I18n.t('observations.all_observations')}
      </Text>
      <Text style={{ fontSize: 12 }}>{I18n.t('observations.view_by')}</Text>
    </View>
  </View>
);

export default ObservationHeader;
