// @flow
import React from 'react';
import type { NavigationScreenProp } from 'react-navigation';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Text,
  Modal,
  Dimensions,
  ImageBackground,
  Image
} from 'react-native';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { isEmpty, size, map, filter } from 'lodash';
import env from '../../../../env.json';
import AddButton from '../../../images/add-button.png';
import Gradient from '../../../images/gradient-overlay.png';
import type { GPSState } from '../../../types/gps';
import CollectionsImg from 'react-native-vector-icons/MaterialIcons';
import type {
  ObservationType,
  UpdateRequest
} from '../../../types/observation';
import ObservationsView from '../ObservationsView';
import Observation from '../../../api/observations';
import Map from './Map';
import {
  WHITE,
  MAPEO_BLUE,
  LIGHT_GREY,
  VERY_LIGHT_BLUE,
  MEDIUM_GREY
} from '../../../lib/styles';
import Header from '../../Base/Header';
import SavedModal from '../../Base/SavedModal';
import { API_DOMAIN_URL } from '../../../api/base';

type Props = {
  navigation: NavigationScreenProp<*>
};

type StateProps = {
  observations: {
    [id: string]: ObservationType
  }
};

const styles = StyleSheet.create({
  buttonText: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '400',
    color: MAPEO_BLUE
  },
  myObservationsIcon: {
    position: 'absolute',
    right: 20,
    top: 15
  },
  cameraIcon: {
    position: 'absolute',
    left: 20,
    top: 15
  },
  profileIcon: {
    position: 'absolute',
    left: 20,
    top: 15
  }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class MapView extends React.Component<Props & StateProps & DispatchProps> {
  constructor(props) {
    super(props);
    this.state = {
      observations: []
    };
  }

  componentDidMount() {
    this.subscription = this.props.navigation.addListener(
      'willFocus',
      this.willFocus
    );
  }

  shouldComponentUpdate() {
    return this.props.navigation.isFocused();
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  willFocus = () => {
    this.getObservations();
  };

  goToCameraView = () => {
    this.props.navigation.navigate({ routeName: 'CameraView' });
  };

  goToObservationsView = () => {
    this.props.navigation.navigate({ routeName: 'ObservationsView' });
  };

  getObservations() {
    var observable = Observation.list();
    var onSuccess = observations => {
      this.setState({ observations });
    };
    var onError = err => {
      console.log('eff', err);
    };
    observable.subscribe(onSuccess, onError);
  }

  render() {
    const { navigation } = this.props;
    const { observations } = this.state;

    return (
      <TouchableWithoutFeedback>
        <View
          style={{
            flex: 1
          }}
        >
          <Header
            leftIcon={
              <TouchableOpacity onPress={this.goToCameraView}>
                <Icon color={WHITE} name="photo-camera" size={30} />
              </TouchableOpacity>
            }
            rightIcon={
              <TouchableOpacity onPress={this.goToObservationsView}>
                <CollectionsImg color={WHITE} name="collections" size={30} />
              </TouchableOpacity>
            }
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 5
            }}
          />
          <SavedModal />
          <Map observations={observations} navigation={navigation} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default MapView;
