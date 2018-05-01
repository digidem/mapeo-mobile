// @flow
import React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { NavigationActions, withNavigation } from 'react-navigation';
import CloseIcon from 'react-native-vector-icons/MaterialIcons';
import ArrowIcon from 'react-native-vector-icons/Feather';
import {
  DARK_GREY,
  CHARCOAL,
  LIGHT_GREY,
  MANGO,
  WHITE,
  MEDIUM_GREY
} from '../../../lib/styles';
import type { Observation } from '../../../types/observation';
import ConfirmPositionImg from '../../../images/confirm-position.png';
import PositionImg from '../../../images/position.png';

export type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  selectedObservation: Observation
};

export type DispatchProps = {
  updateObservation: (o: Observation) => void
};

type State = {
  distanceText: string,
  positionText: string
};

const styles = StyleSheet.create({
  closeIcon: {
    marginHorizontal: 15,
    marginTop: 3
  },
  closeTo: {
    fontSize: 20,
    fontWeight: '700',
    color: WHITE,
    padding: 20,
    flex: 1
  },
  confirmPositionImg: {
    flex: 1,
    alignSelf: 'stretch',
    position: 'absolute',
    height: 200,
    width: Dimensions.get('window').width
  },
  container: {
    flex: 1,
    backgroundColor: DARK_GREY,
    flexDirection: 'column'
  },
  details: {
    margin: 15
  },
  detailLabel: {
    color: LIGHT_GREY,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 10
  },
  forwardButton: {
    backgroundColor: MANGO,
    height: 30,
    width: 45,
    borderRadius: 15,
    marginRight: 15
  },
  forwardIcon: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  gpsText: {
    backgroundColor: DARK_GREY,
    color: 'white',
    marginTop: 15,
    width: 150,
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    fontWeight: '700',
    zIndex: 5
  },
  header: {
    flexDirection: 'row',
    height: 60,
    paddingTop: 15
  },
  map: {
    backgroundColor: 'transparent',
    height: 200,
    alignItems: 'center'
  },
  positionImg: {
    zIndex: 5,
    width: 40,
    height: 47,
    marginTop: 20
  },
  textInput: {
    backgroundColor: CHARCOAL,
    color: WHITE,
    fontSize: 20,
    fontWeight: '700',
    padding: 20,
    marginBottom: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: LIGHT_GREY,
    textAlign: 'center',
    alignItems: 'center'
  }
});

class Position extends React.PureComponent<
  Props & StateProps & DispatchProps,
  State
> {
  constructor(props) {
    super(props);

    this.state = {
      distanceText: '',
      positionText: props.selectedObservation
        ? `${props.selectedObservation.lat}, ${props.selectedObservation.lon}`
        : 'Loading...'
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedObservation !== this.props.selectedObservation &&
      nextProps.selectedObservation
    ) {
      this.setState({
        positionText: `${nextProps.selectedObservation.lat}, ${
          nextProps.selectedObservation.lon
        }`
      });
    }
  }

  handlePositionTextInputChange = text => {
    this.setState({
      distanceText: this.state.distanceText,
      positionText: text
    });
  };

  handleDistanceTextInputChange = text => {
    this.setState({
      distanceText: text,
      positionText: this.state.positionText
    });
  };

  handleUpdateObservation = () => {
    const { updateObservation, selectedObservation, navigation } = this.props;
    const { positionText } = this.state;
    const split = positionText.split(',');

    if (selectedObservation) {
      updateObservation({
        ...selectedObservation,
        lat: parseFloat(split[0].trim()),
        lon: parseFloat(split[1].trim())
      });
      navigation.navigate('Categories');
    }
  };

  render() {
    const { navigation } = this.props;
    const { distanceText, positionText } = this.state;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              const navigateToMapView = NavigationActions.navigate({
                routeName: 'TabBarNavigation',
                params: {},
                actions: [NavigationActions.navigate({ routeName: 'MapView' })]
              });
              navigation.dispatch(navigateToMapView);
            }}
            style={styles.closeIcon}
          >
            <CloseIcon color="gray" name="close" size={25} />
          </TouchableOpacity>
          <Text style={styles.title}>Posicíon</Text>
          <TouchableOpacity
            onPress={this.handleUpdateObservation}
            style={styles.forwardButton}
          >
            <ArrowIcon
              color="white"
              name="arrow-right"
              size={25}
              style={styles.forwardIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.map}>
          <Text style={styles.gpsText}>GPS: Fuerte</Text>
          <Image
            style={styles.confirmPositionImg}
            source={ConfirmPositionImg}
          />
          <Image style={styles.positionImg} source={PositionImg} />
        </View>
        <View style={styles.details}>
          <Text style={styles.detailLabel}>Tu posicíon</Text>
          <TextInput
            value={positionText}
            placeholderTextColor={MEDIUM_GREY}
            onChangeText={this.handlePositionTextInputChange}
            underlineColorAndroid={CHARCOAL}
            style={styles.textInput}
          />
          <Text style={styles.detailLabel}>
            ?Qué tan lejos está la observación?
          </Text>
          <TextInput
            value={distanceText}
            placeholder="Por ejemplo: 20 metros"
            placeholderTextColor={MEDIUM_GREY}
            onChangeText={this.handleDistanceTextInputChange}
            underlineColorAndroid={CHARCOAL}
            style={styles.textInput}
          />
          <Text style={styles.detailLabel}>Cerce de...</Text>
          <View style={{ borderWidth: 2, borderColor: CHARCOAL }}>
            <TextInput
              value="Sinangoe"
              underlineColorAndroid={DARK_GREY}
              style={styles.closeTo}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default withNavigation(Position);
