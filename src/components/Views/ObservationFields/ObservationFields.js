// @flow
import React from 'react';
import {
  View,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView
} from 'react-native';
import { NavigationActions, withNavigationFocus } from 'react-navigation';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CloseIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import I18n from 'react-native-i18n';
import FieldInput from '../../Base/FieldInput';
import type { Field } from '../../../types/field';
import type { Observation } from '../../../types/observation';
import PencilIcon from '../../../images/editor-details.png';
import {
  LIGHT_GREY,
  WHITE,
  MANGO,
  MEDIUM_GREY,
  VERY_LIGHT_BLUE,
  GREEN
} from '../../../lib/styles';
import Header from '../../Base/Header';

export type StateProps = {
  allFields: Object,
  selectedObservation: Observation
};

export type Props = {
  navigation: NavigationActions
};

export type DispatchProps = {
  updateObservation: (o: Observation) => void,
  addObservation: (o: Observation) => void
};

type State = {};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE
  },
  progressContainer: {
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, .8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  progressText: {
    color: WHITE,
    textAlign: 'center',
    fontWeight: '400',
    paddingRight: 25
  }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class ObservationDetails extends React.PureComponent<
  Props & StateProps & DispatchProps,
  State
> {
  constructor(props: StateProps & DispatchProps) {
    super();
    this.state = {};
  }

  handleSaveObservation = () => {
    const { addObservation, selectedObservation } = this.props;

    if (selectedObservation) {
      addObservation(selectedObservation);
    }
  };

  render() {
    const { allFields, navigation, selectedObservation } = this.props;

    const { fields } = selectedObservation;
    const fieldsAnswered = fields.filter(f => f.answered).length;

    const fieldDetails = fields.map((field, i) => (
      <FieldInput
        key={i}
        field={field}
        title={allFields[field.id].name}
        placeholder={allFields[field.id].placeholder}
      />
    ));

    const progressText = `${fieldsAnswered} ${I18n.t('of')} ${
      fields.length
    } ${I18n.t('answered')}`;
    const progressBar = (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 2,
          flexDirection: 'row'
        }}
      >
        {fields.map((field, i) => (
          <View
            key={i}
            style={{
              width: (Dimensions.get('window').width - 175) / fields.length,
              height: 8,
              backgroundColor: field.answered ? GREEN : WHITE,
              borderWidth: 0.5,
              borderRightColor: 'rgba(0, 0, 0, .85)'
            }}
          />
        ))}
      </View>
    );

    return (
      <KeyboardAvoidingView style={styles.container}>
        <Header
          leftIcon={
            <TouchableOpacity
              underlayColor="rgba(0, 0, 0, 0.5)"
              onPress={() => {
                navigation.goBack();
              }}
            >
              <FeatherIcon color="#a5a5a4" name="chevron-left" size={30} />
            </TouchableOpacity>
          }
          rightIcon={<View style={{ width: 30 }} />}
          style={{
            backgroundColor: WHITE,
            borderColor: LIGHT_GREY,
            borderBottomWidth: 1,
            height: 70
          }}
        />
        <ScrollView>{fieldDetails}</ScrollView>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{progressText}</Text>
          {progressBar}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default withNavigationFocus(ObservationDetails);
