// @flow
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import type { NavigationScreenProp } from 'react-navigation';
import { NavigationActions, withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/Feather';
import CloseIcon from 'react-native-vector-icons/MaterialIcons';
import type { UpdateRequest } from '@api/observations';
import { CHARCOAL, MAGENTA, MANGO, WHITE } from '../../../lib/styles';
import type { Observation } from '../../../types/observation';
import Gradient from '../../../images/gradient-overlay.png';
import { getMediaUrl } from '../../../lib/media';
import type { Resource } from '../../../types/redux';
import type { Attachment } from '../../../types/observation';

export type Props = {
  navigation: NavigationScreenProp<*>
};

export type StateProps = {
  selectedObservation?: Observation,
  attachment?: Resource<Attachment>
};

export type DispatchProps = {
  updateObservation: (o: UpdateRequest) => void
};

type State = {
  error: boolean
};

const styles = StyleSheet.create({
  arrowButton: {
    backgroundColor: MANGO,
    height: 40,
    width: 60,
    borderRadius: 25,
    marginRight: 15,
    position: 'absolute',
    bottom: 50
  },
  arrowIcon: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
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
  Props & StateProps & DispatchProps,
  State
> {
  constructor() {
    super();

    this.state = { error: false };
  }

  isFromCameraTab() {
    const { navigation } = this.props;

    return !!navigation.getParam('fromCameraTab', false);
  }

  isFromDetailView() {
    const { navigation } = this.props;

    return !!navigation.getParam('fromDetailView', false);
  }

  handleDeletePhoto = () => {
    const { navigation, updateObservation, selectedObservation } = this.props;

    if (selectedObservation) {
      updateObservation({
        id: selectedObservation.id,
        attachments: selectedObservation.attachments.filter(
          photo => navigation.state.params.photoId !== photo
        )
      });
      navigation.goBack();
    }
  };

  handleImageError = () => {
    this.setState({ error: true });
  };

  render() {
    const { navigation, selectedObservation, attachment } = this.props;
    const { error } = this.state;
    const fromCameraTab = this.isFromCameraTab();
    const fromDetailView = this.isFromDetailView();
    const imageHeight = fromCameraTab
      ? Dimensions.get('window').height
      : Dimensions.get('window').height - 70;
    const hasPhoto =
      selectedObservation &&
      selectedObservation.attachments &&
      selectedObservation.attachments.length >= 1;
    const photoId = navigation.getParam('photoId', '');

    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center'
          }}
        >
          {hasPhoto &&
            !!attachment &&
            attachment.status === 'Success' &&
            !!selectedObservation && (
              <ImageBackground
                style={{
                  width: Dimensions.get('window').width,
                  height: fromDetailView
                    ? Dimensions.get('window').height
                    : imageHeight,
                  alignItems: 'center'
                }}
                onError={this.handleImageError}
                resizeMode="cover"
                source={{
                  uri: error
                    ? attachment.data && attachment.data.originalFallback
                    : getMediaUrl(photoId)
                }}
              >
                {fromCameraTab && (
                  <TouchableOpacity
                    style={styles.arrowButton}
                    onPress={() => navigation.navigate('Position')}
                  >
                    <Icon
                      color="white"
                      name="arrow-right"
                      size={35}
                      style={styles.arrowIcon}
                    />
                  </TouchableOpacity>
                )}
                {fromDetailView && selectedObservation.mock ? (
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      backgroundColor: 'transparent'
                    }}
                  >
                    <ImageBackground
                      source={Gradient}
                      style={{
                        width: Dimensions.get('window').width,
                        height: 100
                      }}
                    >
                      <TouchableOpacity
                        style={{ position: 'absolute', right: 15, top: 15 }}
                        onPress={() => navigation.goBack()}
                      >
                        <CloseIcon
                          color="white"
                          name="close"
                          size={30}
                          style={styles.arrowIcon}
                        />
                      </TouchableOpacity>
                    </ImageBackground>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={{ position: 'absolute', right: 15, top: 15 }}
                    onPress={() => navigation.goBack()}
                  >
                    <CloseIcon
                      color="white"
                      name="close"
                      size={30}
                      style={styles.arrowIcon}
                    />
                  </TouchableOpacity>
                )}
              </ImageBackground>
            )}
        </View>
        {!fromCameraTab &&
          !fromDetailView && (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={this.handleDeletePhoto}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
      </View>
    );
  }
}

export default PhotoView;
