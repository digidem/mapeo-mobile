// @flow
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
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
  VERY_LIGHT_GREEN,
  WHITE
} from '@lib/styles';
import type { Observation } from '@types/observation';

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
    alignSelf: 'center',
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 20,
    fontWeight: '700'
  },
  header: {
    flexDirection: 'row',
    height: 60,
    paddingTop: 15
  },
  map: {
    backgroundColor: VERY_LIGHT_GREEN,
    height: 200
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
  constructor() {
    super();

    this.state = { distanceText: '', positionText: '' };
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

    if (selectedObservation) {
      updateObservation({
        ...selectedObservation
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
          <TouchableHighlight
            onPress={() => navigation.goBack()}
            style={styles.closeIcon}
          >
            <CloseIcon color="gray" name="close" size={25} />
          </TouchableHighlight>
          <Text style={styles.title}>Posicíon</Text>
          <TouchableHighlight
            onPress={this.handleUpdateObservation}
            style={styles.forwardButton}
          >
            <ArrowIcon
              color="white"
              name="arrow-right"
              size={25}
              style={styles.forwardIcon}
            />
          </TouchableHighlight>
        </View>
        <View style={styles.map}>
          <Text style={styles.gpsText}>GPS: Fuerte</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.detailLabel}>Tu posicíon</Text>
          <TextInput
            value={positionText}
            onChangeText={this.handlePositionTextInputChange}
            underlineColorAndroid={CHARCOAL}
            style={styles.textInput}
          />
          <Text style={styles.detailLabel}>
            ?Qué tan lejos está la observación?
          </Text>
          <TextInput
            value={distanceText}
            onChangeText={this.handleDistanceTextInputChange}
            underlineColorAndroid={CHARCOAL}
            style={styles.textInput}
          />
          <Text style={styles.detailLabel}>Cerce de...</Text>
          <View style={{ borderWidth: 2, borderColor: CHARCOAL }}>
            <TextInput value="Sinangoe" style={styles.closeTo} />
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default withNavigation(Position);
