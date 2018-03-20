// @flow
import React from 'react';
import { NavigationActions, withNavigation } from 'react-navigation';
import {
  View,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Image,
  Dimensions,
  FlatList
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import type { Category } from '../../../types/category';
import type { Observation } from '../../../types/observation';
import {
  DARK_GREY,
  LIGHT_GREY,
  CHARCOAL,
  WHITE,
  MANGO,
  MEDIUM_GREY,
  VERY_LIGHT_GREEN
} from '../../../lib/styles';
import PositionImg from '../../../images/position.png';

export type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  category?: Category,
  selectedObservation: Observation
};

export type DispatchProps = {
  updateObservation: (o: Observation) => void,
  goToObservationDetailReview: () => void,
  goToPhotoView: (photoSource: string) => void
};

type State = {
  text: string
};

const styles = StyleSheet.create({
  addText: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: '700',
    color: 'black'
  },
  bottomButton: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: WHITE,
    height: 60,
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1
  },
  bottomButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black'
  },
  categoryAtText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '400'
  },
  categoryContainer: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'center'
  },
  categoryName: {
    fontSize: 15,
    color: 'black',
    fontWeight: '600'
  },
  categoryPositionText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '700'
  },
  categoryRow: {
    flexDirection: 'row',
    height: 65,
    borderBottomWidth: 1,
    borderColor: LIGHT_GREY
  },
  close: {
    position: 'absolute',
    left: 10
  },
  collectionsImg: {
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: WHITE
  },
  forward: {
    position: 'absolute',
    right: 10,
    backgroundColor: MANGO,
    height: 30,
    width: 45,
    borderRadius: 15,
  },
  forwardIcon: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 2
  },
  header: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1
  },
  map: {
    height: 65,
    width: 65,
    backgroundColor: VERY_LIGHT_GREEN,
    justifyContent: 'center'
  },
  mediaPlaceholder: {
    justifyContent: 'center',
    width: 65,
    height: 65,
    backgroundColor: 'lightgray'
  },
  mediaPlaceholderRow: {
    flex: 1,
    backgroundColor: 'whitesmoke',
    borderColor: LIGHT_GREY,
    borderTopWidth: 1,
    borderBottomWidth: 1
  },
  positionImg: {
    width: 35,
    height: 41,
    alignSelf: 'center'
  },
  textInput: {
    fontSize: 20,
    height: 130,
    padding: 20,
    paddingBottom: 30,
    color: 'black',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    backgroundColor: 'whitesmoke'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black'
  }
});

class ObservationEditor extends React.PureComponent<
  Props & StateProps & DispatchProps,
  State
> {
  constructor(props: Props & StateProps & DispatchProps) {
    super();

    this.state = {
      text: props.selectedObservation ? props.selectedObservation.notes : ''
    };
  }

  componentDidMount() {
    const { updateObservation, selectedObservation, category } = this.props;

    if (selectedObservation && category) {
      updateObservation({
        ...selectedObservation,
        type: category.name,
        name: category.name
      });
    }
  }

  handleTextInputChange = text => {
    this.setState({ text });
  };

  handleUpdateObservation = () => {
    const {
      updateObservation,
      selectedObservation,
      goToObservationDetailReview
    } = this.props;
    const { text } = this.state;

    if (selectedObservation) {
      updateObservation({
        ...selectedObservation,
        notes: text
      });
      goToObservationDetailReview();
    }
  };

  handleTextInputBlur = () => {
    const { selectedObservation, updateObservation } = this.props;

    if (selectedObservation) {
      updateObservation({
        ...selectedObservation,
        notes: this.state.text
      });
    }
  };

  goToCameraView = () => {
    const { selectedObservation, updateObservation, navigation } = this.props;

    if (selectedObservation) {
      updateObservation({
        ...selectedObservation,
        notes: this.state.text
      });
    }
    const cameraAction = NavigationActions.navigate({
      routeName: 'CameraView'
    });
    navigation.dispatch(cameraAction);
  };

  renderHeader = () => {
    const { navigation } = this.props;

    return (
      <View style={styles.header}>
        <TouchableHighlight
          style={styles.close}
          onPress={() => navigation.navigate('Categories')}
        >
          <Icon color="lightgray" name="close" size={25} />
        </TouchableHighlight>
        <Text style={styles.title}>Observaciones</Text>
        <TouchableHighlight
          style={styles.forward}
          onPress={this.handleUpdateObservation}
        >
          <FeatherIcon
            color="white"
            name="arrow-right"
            size={25}
            style={styles.forwardIcon}
          />
        </TouchableHighlight>
      </View>
    );
  };

  render() {
    const { navigation, selectedObservation, goToPhotoView } = this.props;
    const { text } = this.state;
    const positionText = selectedObservation
        ? `${selectedObservation.lat}, ${selectedObservation.lon}`
        : 'Loading...';
    const keyExtractor = item => item.source;

    if (!selectedObservation) {
      navigation.goBack();
      return <View />;
    }

    return (
      <KeyboardAvoidingView style={styles.container}>
        {this.renderHeader()}
        <View style={{ flex: 1 }}>
          <View style={styles.categoryRow}>
            <View style={styles.map}>
              <Image style={styles.positionImg} source={PositionImg} />
            </View>
            <View style={styles.categoryContainer}>
              <View style={{ flexDirection: 'column', flex: 1 }}>
                <Text style={styles.categoryName}>
                  {selectedObservation.type}
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.categoryAtText}>at </Text>
                  <Text style={styles.categoryPositionText}>{positionText}</Text>
                </View>
              </View>
              <TouchableHighlight
                onPress={() => navigation.navigate('Categories')}
                style={{ flex: 1, position: 'absolute', right: 5, alignSelf: 'center' }}
              >
                <FeatherIcon
                  color="lightgray"
                  name="chevron-right"
                  size={25}
                />
              </TouchableHighlight>
            </View>
          </View>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={this.handleTextInputChange}
            placeholder="¿Qué está pasando aquí..."
            placeholderTextColor="silver"
            underlineColorAndroid="transparent"
            onBlur={this.handleTextInputBlur}
            multiline
            autoGrow
          />
          {selectedObservation &&
            !selectedObservation.media.length && (
              <View style={styles.mediaPlaceholderRow}>
                <View style={styles.mediaPlaceholder}>
                  <Icon
                    color={WHITE}
                    name="photo"
                    size={30}
                    style={styles.collectionsImg}
                  />
                </View>
              </View>
            )}
          {selectedObservation &&
            !!selectedObservation.media.length && (
              <FlatList
                horizontal
                style={{
                  flexDirection: 'column',
                  position: 'absolute',
                  bottom: 55
                }}
                contentContainerStyle={{
                  alignContent: 'flex-start'
                }}
                keyExtractor={keyExtractor}
                renderItem={({ item }) => (
                  <TouchableHighlight
                    onPress={() => goToPhotoView(item.source)}
                  >
                    <Image
                      source={{ uri: item.source }}
                      style={{
                        width: Dimensions.get('window').width / 5,
                        height: Dimensions.get('window').width / 5
                      }}
                    />
                  </TouchableHighlight>
                )}
                data={selectedObservation.media}
              />
            )}
          <View style={styles.bottomButton}>
            <Text style={styles.addText}>Add...</Text>
          </View>
          <TouchableHighlight
            style={styles.bottomButton}
            onPress={this.goToCameraView}
          >
            <View style={{ flexDirection: 'row' }}>
              <Icon
                color={MEDIUM_GREY}
                name="photo-camera"
                size={30}
                style={{ marginHorizontal: 30 }}
              />
              <Text style={styles.bottomButtonText}>Photos & Videos</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.bottomButton}>
            <View style={{ flexDirection: 'row' }}>
              <FontAwesomeIcon
                color={MEDIUM_GREY}
                name="microphone"
                size={30}
                style={{ marginHorizontal: 35 }}
              />
              <Text style={styles.bottomButtonText}>Audio</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style={styles.bottomButton}>
            <View style={{ flexDirection: 'row' }}>
              <FontAwesomeIcon
                color={MEDIUM_GREY}
                name="pencil"
                size={30}
                style={{ marginHorizontal: 32 }}
              />
              <Text style={styles.bottomButtonText}>Details</Text>
            </View>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default withNavigation(ObservationEditor);
