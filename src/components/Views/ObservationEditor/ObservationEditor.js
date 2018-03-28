// @flow
import React from 'react';
import { NavigationActions, withNavigation } from 'react-navigation';
import {
  View,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  Image,
  ImageBackground,
  FlatList
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import type { Category } from '../../../types/category';
import type { Observation } from '../../../types/observation';
import CategoryPin from '../../../images/category-pin.png';
import PencilIcon from '../../../images/editor-details.png';
import {
  LIGHT_GREY,
  WHITE,
  MANGO,
  MEDIUM_GREY,
  VERY_LIGHT_BLUE
} from '../../../lib/styles';

export type Props = {
  navigation: NavigationActions
};

export type StateProps = {
  category?: Category,
  selectedObservation: Observation
};

export type DispatchProps = {
  updateObservation: (o: Observation) => void,
  goToPhotoView: (photoSource: string) => void,
  addObservation: (o: Observation) => void,
  resetNavigation: () => void
};

type State = {
  goToCamera: boolean,
  keyboardShown: boolean,
  text: string
};

const styles = StyleSheet.create({
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
  categoryName: {
    fontSize: 15,
    color: 'black',
    fontWeight: '600'
  },
  categoryPin: {
    width: 80,
    height: 90,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryPositionText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '700'
  },
  check: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: MANGO,
    height: 35,
    width: 35,
    borderRadius: 50,
    justifyContent: 'center'
  },
  checkIcon: {
    alignSelf: 'center'
  },
  collectionsImg: {
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: WHITE
  },
  greyCheck: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: LIGHT_GREY,
    height: 35,
    width: 35,
    borderRadius: 50,
    justifyContent: 'center'
  },
  header: {
    height: 150,
    backgroundColor: VERY_LIGHT_BLUE,
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1
  },
  mediaRow: {
    flex: 1,
    backgroundColor: WHITE,
    borderColor: LIGHT_GREY,
    borderTopWidth: 1,
    paddingVertical: 15
  },
  mediaRowKeyboardShown: {
    flex: 1,
    backgroundColor: WHITE,
    borderColor: LIGHT_GREY,
    paddingVertical: 15
  },
  photosButton: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: WHITE,
    height: 60,
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1,
    borderTopWidth: 1
  },
  textInput: {
    fontSize: 20,
    height: 145,
    padding: 20,
    paddingBottom: 30,
    color: 'black',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    backgroundColor: 'white',
    borderColor: LIGHT_GREY
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'black',
    textAlign: 'center'
  },
  titleLong: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
    textAlign: 'center'
  }
});

class ObservationEditor extends React.PureComponent<
  Props & StateProps & DispatchProps,
  State
> {
  constructor(props: Props & StateProps & DispatchProps) {
    super();

    this.state = {
      keyboardShown: false,
      text: props.selectedObservation ? props.selectedObservation.notes : '',
      goToCamera: false
    };
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide
    );
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

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardDidShowListener: any;
  keyboardDidHideListener: any;

  keyboardDidShow = () => {
    this.setState(previousState => ({
      goToCamera: false,
      keyboardShown: true,
      text: previousState.text
    }));
  };

  keyboardDidHide = () => {
    if (this.state.goToCamera) {
      this.setState(previousState => ({
        goToCamera: false,
        keyboardShown: false,
        text: previousState.text
      }));
      this.props.navigation.navigate('CameraView');
    } else {
      this.setState(previousState => ({
        goToCamera: previousState.goToCamera,
        keyboardShown: false,
        text: previousState.text
      }));
    }
  };

  handleTextInputChange = text => {
    this.setState({ text });
  };

  handleSaveObservation = () => {
    const { addObservation, selectedObservation, resetNavigation } = this.props;
    const { text } = this.state;

    if (selectedObservation) {
      addObservation({
        ...selectedObservation,
        notes: text
      });
      resetNavigation();
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
    if (this.state.keyboardShown) {
      this.setState(previousState => ({
        goToCamera: true,
        keyboardShown: false,
        text: previousState.text
      }));
    } else {
      navigation.navigate('CameraView');
    }
    Keyboard.dismiss();
  };

  render() {
    const { navigation, selectedObservation, goToPhotoView } = this.props;
    const { keyboardShown, text } = this.state;
    const positionText = selectedObservation
      ? `${selectedObservation.lat}, ${selectedObservation.lon}`
      : 'Loading...';
    const keyExtractor = item => item.source;
    const showGreyCheck =
      text === '' && selectedObservation && !selectedObservation.media.length;

    if (!selectedObservation) {
      navigation.goBack();
      return <View />;
    }

    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.header}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'center'
            }}
          >
            <TouchableHighlight
              style={{ position: 'absolute', left: 20, top: 20 }}
              onPress={() => navigation.navigate('Categories')}
            >
              <FeatherIcon color="lightgray" name="chevron-left" size={25} />
            </TouchableHighlight>
            <ImageBackground source={CategoryPin} style={styles.categoryPin}>
              {selectedObservation && (
                <View style={{ marginTop: -10 }}>
                  {selectedObservation.icon}
                </View>
              )}
            </ImageBackground>
            {showGreyCheck && (
              <View style={styles.greyCheck}>
                <FeatherIcon
                  color="white"
                  name="check"
                  size={15}
                  style={styles.checkIcon}
                />
              </View>
            )}
            {!showGreyCheck && (
              <TouchableHighlight
                style={styles.check}
                onPress={this.handleSaveObservation}
              >
                <FeatherIcon
                  color="white"
                  name="check"
                  size={15}
                  style={styles.checkIcon}
                />
              </TouchableHighlight>
            )}
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 10
            }}
          >
            <Text
              style={
                selectedObservation.type.length > 31
                  ? styles.titleLong
                  : styles.title
              }
            >
              {selectedObservation.type}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.categoryAtText}>at </Text>
              <Text style={styles.categoryPositionText}>{positionText}</Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={this.handleTextInputChange}
            placeholder="What's happening here?"
            placeholderTextColor="silver"
            underlineColorAndroid="transparent"
            onBlur={this.handleTextInputBlur}
            multiline
            autoGrow
          />
          {selectedObservation &&
            !!selectedObservation.media.length && (
              <View
                style={
                  keyboardShown ? styles.mediaRowKeyboardShown : styles.mediaRow
                }
              >
                <FlatList
                  horizontal
                  scrollEnabled
                  style={{
                    flex: 1,
                    flexDirection: 'row'
                  }}
                  contentContainerStyle={{
                    alignContent: 'flex-start'
                  }}
                  keyExtractor={keyExtractor}
                  renderItem={({ item }) => (
                    <TouchableHighlight
                      onPress={() => goToPhotoView(item.source)}
                      style={{ paddingLeft: 10 }}
                    >
                      <Image
                        source={{ uri: item.source }}
                        style={{
                          width: 65,
                          height: 65,
                          borderRadius: 5
                        }}
                      />
                    </TouchableHighlight>
                  )}
                  data={selectedObservation.media}
                />
              </View>
            )}
          <View
            style={{
              paddingTop: 15,
              borderTopWidth: 1,
              borderColor: LIGHT_GREY,
              position: 'absolute',
              bottom: 15,
              left: 0,
              right: 0
            }}
          >
            <View
              style={{
                flexDirection: 'row'
              }}
            >
              {keyboardShown && (
                <TouchableHighlight
                  style={{ flex: 1, marginLeft: 60 }}
                  onPress={this.goToCameraView}
                  underlayColor="transparent"
                >
                  <Icon color={MEDIUM_GREY} name="photo-camera" size={30} />
                </TouchableHighlight>
              )}
              {keyboardShown && (
                <TouchableHighlight style={{ flex: 1, marginLeft: 20 }}>
                  <FontAwesomeIcon
                    color={MEDIUM_GREY}
                    name="microphone"
                    size={30}
                  />
                </TouchableHighlight>
              )}
              {keyboardShown && (
                <TouchableHighlight style={{ flex: 1, marginLeft: 10 }}>
                  <Image
                    source={PencilIcon}
                    style={{ marginTop: 2, width: 25, height: 25 }}
                  />
                </TouchableHighlight>
              )}
            </View>
          </View>
          {!keyboardShown && (
            <View
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
            >
              <TouchableHighlight
                style={styles.photosButton}
                onPress={this.goToCameraView}
                underlayColor="transparent"
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
                  <Image
                    source={PencilIcon}
                    style={{
                      marginLeft: 34,
                      marginRight: 31,
                      width: 25,
                      height: 25
                    }}
                  />
                  <Text style={styles.bottomButtonText}>Details</Text>
                </View>
              </TouchableHighlight>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default withNavigation(ObservationEditor);
