// @flow
import React from 'react';
import {
  Dimensions,
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import type { Observation } from '../../../types/observation';
import type { Category } from '../../../types/category';
import I18n from 'react-native-i18n';
import moment from '../../../lib/localizedMoment';
import {
  DARK_MANGO,
  WHITE,
  MAPEO_BLUE,
  MANGO,
  LIGHT_GREY,
  MEDIUM_GREY
} from '../../../lib/styles';

export type Props = {
  onContinue: Function,
  visible: boolean
};

const styles = StyleSheet.create({
  continue: {
    fontWeight: '700',
    fontSize: 16,
    color: WHITE
  },
  continueButton: {
    flex: 1,
    alignSelf: 'stretch',
    paddingVertical: 5,
    marginTop: 15,
    marginBottom: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: MANGO,
    borderColor: DARK_MANGO,
    borderWidth: 2,
    borderRadius: 30
  },
  confirmationModal: {
    alignSelf: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').height * 0.4,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10
  },
  details: {
    fontSize: 16,
    color: MEDIUM_GREY,
    textAlign: 'center'
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    color: 'black'
  },
  top: {
    flex: 2,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: LIGHT_GREY,
    borderBottomWidth: 1
  }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class SyncedModal extends React.Component<Props> {
  render() {
    const { onContinue, visible } = this.props;
    return (
      <Modal
        animation="slide"
        transparent
        visible={visible}
        onRequestClose={() => {}}
      >
        <View
          style={{
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <View style={styles.confirmationModal}>
            <View style={styles.top}>
              <Text style={styles.title}>{I18n.t('sync.modal.title')}</Text>
              <Text style={styles.details}>{I18n.t('sync.modal.details')}</Text>
            </View>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={onContinue}
            >
              <Text style={styles.continue}>{I18n.t('sync.modal.ok')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default SyncedModal;
