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
import { NavigationActions } from 'react-navigation';
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
  goBack: () => void,
  navigation: NavigationActions,
  onContinue: Function,
  onCancel: Function,
  visible: boolean
};

type State = {
  visible: boolean
};

const styles = StyleSheet.create({
  cancel: {
    fontWeight: '700',
    fontSize: 16,
    color: WHITE
  },
  cancelButton: {
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
    height: Dimensions.get('window').height * 0.5,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10
  },
  continue: {
    fontSize: 16,
    color: MAPEO_BLUE
  },
  continueButton: {
    flex: 1,
    alignSelf: 'stretch',
    paddingVertical: 15,
    marginHorizontal: 10,
    borderBottomColor: LIGHT_GREY,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  question: {
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

class CancelModal extends React.Component<Props, State> {
  state = { visible: false };

  // componentDidUpdate(prevProps: Props, prevState: State) {
  //   if (this.props.visible !== prevProps.visible) {
  //     this.setState({ visible: this.props.visible });
  //   }
  // }

  handleContinue = () => {
    this.setState({ visible: false });
  };

  handleCancel = () => {
    const { goBack } = this.props;
    this.setState({ visible: false });
    goBack();
  };
  render() {
    const { onCancel, onContinue, visible } = this.props;
    // const visible = this.state.visible;
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
              <Text style={styles.title}>{I18n.t('editor.modal.title')}</Text>
              <Text style={styles.question}>
                {I18n.t('editor.modal.question')}
              </Text>
            </View>
            <View style={styles.continueButton}>
              <TouchableOpacity onPress={onContinue}>
                <Text style={styles.continue}>
                  {I18n.t('editor.modal.continue')}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancel}>{I18n.t('editor.modal.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default CancelModal;
