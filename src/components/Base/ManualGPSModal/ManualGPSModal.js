// @flow
import React from 'react';
import I18n from 'react-native-i18n';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import type { GPSState } from '../../../types/gps';
import type { Resource } from '../../../types/redux';
import {
  WHITE,
  LIGHT_GREY,
  DARK_GREY,
  MAPEO_BLUE,
  MANGO,
  DARK_MANGO
} from '../../../lib/styles';

export type StateProps = {
  gps?: Resource<GPSState>,
  visible: boolean
};

export type Props = {
  goToManualEnter: () => void,
  onWaiting: Function,
  onSave: Function
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.8)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    backgroundColor: WHITE,
    width: windowWidth * 0.75,
    borderRadius: 20
  },
  top: {
    padding: 40
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    textAlign: 'center',
    marginBottom: 20
  },
  text: {
    fontSize: 15,
    color: DARK_GREY,
    fontWeight: '400',
    textAlign: 'center'
  },
  borderTop: {
    borderTopColor: LIGHT_GREY,
    borderTopWidth: 1
  },
  button: {
    paddingVertical: 15,
    marginHorizontal: 10,
    borderBottomColor: LIGHT_GREY,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: MAPEO_BLUE
  },
  saveButton: {
    backgroundColor: MANGO,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderColor: DARK_MANGO,
    borderWidth: 3,
    padding: 10
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: WHITE
  }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

const ManualGPSModal: React.SFC<Props & StateProps> = ({
  onWaiting,
  goToManualEnter,
  onSave,
  gps,
  visible
}) => {
  if (!visible) {
    return null;
  }

  const showWeak = gps.status === 'Success' && gps.data.accuracy > 100;
  let heading = I18n.t('manual_gps.searching');
  let text = I18n.t('manual_gps.searching_text');

  if (showWeak) {
    heading = I18n.t('manual_gps.weak');
    text = I18n.t('manual_gps.weak_text');
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.top}>
          <Text style={styles.heading}>{heading}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.borderTop]}
          onPress={onWaiting}
        >
          <Text style={styles.buttonText}>{I18n.t('manual_gps.waiting')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToManualEnter}>
          <Text style={styles.buttonText}>
            {I18n.t('manual_gps.manual_enter')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>{I18n.t('manual_gps.save')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManualGPSModal;
