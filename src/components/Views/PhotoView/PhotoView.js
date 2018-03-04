// @flow
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Image,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { NavigationActions, withNavigation } from 'react-navigation';
import { CHARCOAL, MAGENTA, WHITE } from '../../../lib/styles';
import type { Observation } from '../../../types/observation';

export type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  selectedObservation: Observation
};

export type DispatchProps = {
  updateObservation: (o: Observation) => void
};

const styles = StyleSheet.create({
  backButton: {
    flex: 1,
    backgroundColor: CHARCOAL,
    justifyContent: 'center',
    height: 65
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: WHITE
  },
  deleteButton: {
    flex: 1,
    backgroundColor: MAGENTA,
    justifyContent: 'center',
    height: 65
  }
});

class PhotoView extends React.PureComponent<
  Props & StateProps & DispatchProps
> {
  handleDeletePhoto = () => {
    const { navigation, updateObservation, selectedObservation } = this.props;

    if (selectedObservation) {
      updateObservation({
        ...selectedObservation,
        media: []
      });
      navigation.goBack();
    }
  };

  render() {
    const { navigation, selectedObservation } = this.props;
    const hasPhoto =
      selectedObservation &&
      selectedObservation.media &&
      selectedObservation.media.length >= 1;

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center'
          }}
        >
          {hasPhoto && (
            <Image
              style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height - 70
              }}
              source={{ uri: selectedObservation.media[0].source }}
            />
          )}
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableHighlight
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.deleteButton}
            onPress={this.handleDeletePhoto}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

export default withNavigation(PhotoView);
