// @flow
import React from 'react';
import {
  View,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  FlatList,
  ScrollView
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CheckIcon from 'react-native-vector-icons/Octicons';
import CloseIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import LocationPin from 'react-native-vector-icons/Entypo';
import I18n from 'react-native-i18n';
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
import Header from '../../Base/Header';

export type StateProps = {
  category?: Category,
  selectedObservation?: Observation,
  observations: Observation[]
};

export type Props = {
  isFocused: boolean,
  navigation: any
};

export type DispatchProps = {
  updateObservation: (o: Observation) => void,
  goToPhotoView: (photoSource: string) => void,
  goToObservationFields: () => void,
  addObservation: (o: Observation) => void,
  goToCameraView: () => void,
  goToMainCameraView: () => void,
  goToCategories: () => void,
  goBack: () => void,
  goToMapView: () => void,
  showSavedModal: () => void
};

type State = {
  goToCamera: boolean,
  keyboardShown: boolean,
  text: string,
  keyboardHeight: number
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
    fontWeight: '700',
    marginLeft: 3
  },
  check: {
    backgroundColor: MANGO,
    height: 25,
    width: 25,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkOuterCircle: {
    width: 30,
    height: 30,
    backgroundColor: '#ed6109',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkIcon: {
    alignSelf: 'center',
    marginLeft: 3
  },
  circle: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 50,
    borderColor: LIGHT_GREY,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    shadowOpacity: 1,
    margin: 5
  },
  collectionsImg: {
    alignSelf: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: WHITE
  },
  greyCheck: {
    backgroundColor: LIGHT_GREY,
    height: 25,
    width: 25,
    borderRadius: 50,
    justifyContent: 'center'
  },
  greyCheckOuterCircle: {
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d6d2cf'
  },
  mediaRow: {
    backgroundColor: WHITE,
    borderColor: LIGHT_GREY,
    borderTopWidth: 1,
    height: 85
  },
  mediaRowKeyboardShown: {
    flex: 1,
    backgroundColor: WHITE,
    borderColor: LIGHT_GREY,
    marginBottom: -100
  },
  photosButton: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: WHITE,
    height: 60,
    borderColor: LIGHT_GREY,
    borderBottomWidth: 1
  },
  textInput: {
    flex: 1,
    fontSize: 20,
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
  },
  triangle: {
    alignSelf: 'center',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(0, 0, 0, .8)',
    transform: [{ rotate: '180deg' }]
  }
});

I18n.fallbacks = true;
I18n.translations = {
  en: require('../../../translations/en'),
  es: require('../../../translations/es')
};

class ObservationEditor extends React.Component<
  Props & StateProps & DispatchProps,
  State
> {
  paddingInput: Animated.Value;
  keyboardWillShowListener: any;
  keyboardWillHideListener: any;
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;
  scrollView: any;
  textInput: any;

  constructor(props: StateProps & DispatchProps) {
    super();

    this.paddingInput = new Animated.Value(0);

    this.state = {
      keyboardShown: false,
      text: props.selectedObservation ? props.selectedObservation.notes : '',
      goToCamera: false,
      keyboardHeight: 0
    };
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide
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

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide
    );
  }

  shouldComponentUpdate(
    nextProps: Props & StateProps & DispatchProps,
    nextState: State
  ) {
    if (nextProps.isFocused) {
      return nextProps !== this.props || nextState !== this.state;
    }

    return false;
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  keyboardWillShow = e => {
    Animated.timing(this.paddingInput, {
      duration: e.duration,
      toValue: 60
    }).start();
  };

  keyboardWillHide = e => {
    Animated.timing(this.paddingInput, {
      duration: e.duration,
      toValue: 0
    }).start();
  };

  keyboardDidShow = e => {
    this.setState(previousState => ({
      goToCamera: false,
      keyboardShown: true,
      text: previousState.text,
      keyboardHeight: e.endCoordinates.height
    }));
  };

  keyboardDidHide = () => {
    if (this.state.goToCamera) {
      this.setState(previousState => ({
        goToCamera: false,
        keyboardShown: false,
        text: previousState.text
      }));
      this.props.goToCameraView();
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
    const {
      addObservation,
      selectedObservation,
      goToMapView,
      showSavedModal,
      goToMainCameraView
    } = this.props;
    const { text } = this.state;

    if (selectedObservation) {
      addObservation({
        ...selectedObservation,
        notes: text
      });
    }

    showSavedModal();
    if (selectedObservation && selectedObservation.createdFrom === 'map') {
      goToMapView();
    } else {
      goToMainCameraView();
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
    const {
      selectedObservation,
      updateObservation,
      goToCameraView
    } = this.props;

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
      goToCameraView();
    }
    Keyboard.dismiss();
  };

  goToCategoriesView = () => {
    const {
      goBack,
      goToCategories,
      observations,
      selectedObservation
    } = this.props;
    let updateFlow = false;
    if (selectedObservation) {
      observations.forEach(o => {
        if (o.id === selectedObservation.id) {
          updateFlow = true;
        }
      });
    }

    if (updateFlow) {
      goToCategories();
    } else {
      goBack();
    }
  };

  goToObservationFields = () => {
    const { goToObservationFields } = this.props;
    goToObservationFields();
    Keyboard.dismiss();
  };

  render() {
    const {
      navigation,
      goBack,
      selectedObservation,
      goToPhotoView,
      goToObservationFields
    } = this.props;
    const { keyboardShown, text } = this.state;
    const positionText = selectedObservation
      ? `${selectedObservation.lat}, ${selectedObservation.lon}`
      : 'Loading...';
    const keyExtractor = item => item.source;

    let fieldAnswered;
    if (selectedObservation) {
      fieldAnswered = selectedObservation.fields.find(f => f.answered);
    }

    const showGreyCheck =
      text === '' &&
      selectedObservation &&
      !selectedObservation.media.length &&
      !fieldAnswered;

    if (!selectedObservation) {
      goBack();
      return <View />;
    }

    return (
      <KeyboardAvoidingView style={styles.container}>
        <Header
          leftIcon={
            <TouchableOpacity
              underlayColor="rgba(0, 0, 0, 0.5)"
              onPress={goBack}
            >
              <CloseIcon color="#9E9C9C" name="window-close" size={30} />
            </TouchableOpacity>
          }
          rightIcon={
            showGreyCheck ? (
              <View style={styles.greyCheckOuterCircle}>
                <View style={styles.greyCheck}>
                  <CheckIcon
                    color="white"
                    name="check"
                    size={18}
                    style={styles.checkIcon}
                  />
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.checkOuterCircle}
                onPress={this.handleSaveObservation}
              >
                <View style={styles.check}>
                  <CheckIcon
                    color="white"
                    name="check"
                    size={18}
                    style={styles.checkIcon}
                  />
                </View>
              </TouchableOpacity>
            )
          }
          showTriangle
          style={{
            backgroundColor: VERY_LIGHT_BLUE
          }}
        />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 10,
            backgroundColor: VERY_LIGHT_BLUE
          }}
        >
          <TouchableOpacity onPress={this.goToCategoriesView}>
            <View style={styles.circle}>
              {selectedObservation.icon && (
                <Image
                  source={selectedObservation.icon}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              )}
            </View>
          </TouchableOpacity>
          <View style={{ marginTop: 5, flexDirection: 'row' }}>
            <LocationPin color={MANGO} name="location-pin" size={15} />
            <Text style={styles.categoryPositionText}>{positionText}</Text>
          </View>
        </View>
        <ScrollView
          ref={ref => (this.scrollView = ref)}
          contentContainerStyle={{ flex: 1 }}
        >
          <TextInput
            ref={ref => (this.textInput = ref)}
            style={styles.textInput}
            value={text}
            onChangeText={this.handleTextInputChange}
            onFocus={() => this.scrollView.scrollToEnd()}
            placeholder={I18n.t('editor.placeholder')}
            placeholderTextColor="silver"
            underlineColorAndroid="transparent"
            onBlur={this.handleTextInputBlur}
            multiline
            autoGrow
            autoFocus
          />
        </ScrollView>
        {!!selectedObservation &&
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
                  flexDirection: 'row',
                  paddingTop: 10
                }}
                contentContainerStyle={{
                  alignContent: 'flex-start'
                }}
                keyExtractor={keyExtractor}
                renderItem={({ item }) => (
                  <TouchableOpacity
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
                  </TouchableOpacity>
                )}
                data={selectedObservation.media}
              />
            </View>
          )}
        <View
          style={{
            borderTopWidth: 1,
            borderColor: LIGHT_GREY
          }}
        >
          {keyboardShown && (
            <Animated.View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                backgroundColor: 'white',
                marginBottom: this.state.keyboardHeight,
                height: 55
              }}
            >
              <TouchableOpacity
                onPress={this.goToCameraView}
                underlayColor="transparent"
                style={{ flex: 1, alignItems: 'center' }}
              >
                <Icon color={MEDIUM_GREY} name="photo-camera" size={30} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.goToObservationFields}
                underlayColor="transparent"
                style={{ flex: 1, alignItems: 'center' }}
              >
                <Image source={PencilIcon} style={{ width: 25, height: 25 }} />
              </TouchableOpacity>
            </Animated.View>
          )}
          {!keyboardShown && (
            <View>
              <TouchableOpacity
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
                  <Text style={styles.bottomButtonText}>
                    {I18n.t('editor.media_button')}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.bottomButton}
                onPress={this.goToObservationFields}
                underlayColor="transparent"
              >
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
                  <Text style={styles.bottomButtonText}>
                    {I18n.t('editor.details_button')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default withNavigationFocus(ObservationEditor);
