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
  ImageBackground,
  FlatList,
  ScrollView
} from 'react-native';
import Image from 'react-native-remote-svg';
import type { NavigationScreenProp } from 'react-navigation';
import CancelModal from '../../Base/CancelModal/CancelModal';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CheckIcon from 'react-native-vector-icons/Octicons';
import CloseIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import LocationPin from 'react-native-vector-icons/Entypo';
import I18n from 'react-native-i18n';
import type { UpdateRequest } from '@api/observations';
import type { Category } from '../../../types/category';
import type { Observation } from '../../../types/observation';
import type { GPSState } from '../../../types/gps';
import CategoryPin from '../../../images/category-pin.png';
import PencilIcon from '../../../images/editor-details.png';
import {
  DARK_MANGO,
  LIGHT_GREY,
  WHITE,
  MANGO,
  MEDIUM_GREY,
  VERY_LIGHT_BLUE
} from '../../../lib/styles';
import Header from '../../Base/Header';
import ManualGPSModal from '../../Base/ManualGPSModal';
import getGPSText from '../../../lib/getGPSText';
import { HIGH_ACCURACY } from '../../../ducks/gps';
import Thumbnail from '../../Base/Thumbnail';

export type StateProps = {
  category?: Category,
  selectedObservation?: Observation,
  observations: Observation[],
  observationSource: string,
  cancelModalVisible: boolean,
  gps: GPSState,
  manualGPSModalVisible: boolean,
  gpsFormat: string,
  icons: Object
};

export type Props = {
  navigation: NavigationScreenProp<*>
};

export type DispatchProps = {
  updateObservation: (o: UpdateRequest) => void,
  showCancelModal: () => void,
  hideCancelModal: () => void,
  clearSelectedObservation: () => void,
  hideManualGPSModal: () => void,
  showManualGPSModal: () => void,
  saveObservation: (update: boolean) => void
};

type State = {
  goToCamera: boolean,
  keyboardShown: boolean,
  text: string,
  keyboardHeight: number,
  observationExists: boolean,
  numExistingPhotos: number,
  existingNotes: string,
  numExistingFieldsAnswered: number
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
    backgroundColor: DARK_MANGO,
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
  focusListener: any;

  constructor(props: Props & StateProps & DispatchProps) {
    super();

    this.paddingInput = new Animated.Value(0);

    const { observations, selectedObservation } = props;
    let observationExists = false;
    let numExistingPhotos = 0;
    let existingNotes = '';
    let numExistingFieldsAnswered = 0;
    if (selectedObservation && observations) {
      if (observations.find(o => o.id === selectedObservation.id)) {
        observationExists = true;
        numExistingPhotos = selectedObservation.attachments.length;
        existingNotes = selectedObservation.notes;
        numExistingFieldsAnswered = selectedObservation.fields.filter(
          field => field.answered
        ).length;
      }
    }

    this.state = {
      keyboardShown: false,
      text: props.selectedObservation ? props.selectedObservation.notes : '',
      goToCamera: false,
      keyboardHeight: 0,
      observationExists,
      numExistingPhotos,
      existingNotes,
      numExistingFieldsAnswered
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
    const {
      updateObservation,
      selectedObservation,
      category,
      hideManualGPSModal,
      navigation
    } = this.props;

    if (hideManualGPSModal) {
      hideManualGPSModal();
    }

    if (selectedObservation && category) {
      updateObservation({
        ...selectedObservation,
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

    this.focusListener = navigation.addListener('willFocus', this.onFocus);
  }

  onFocus = () => {
    const { manualGPSModalVisible, hideManualGPSModal } = this.props;

    if (manualGPSModalVisible) {
      hideManualGPSModal();
    }
  };

  componentWillReceiveProps(nextProps: StateProps & DispatchProps & Props) {
    const { observations, selectedObservation } = this.props;

    if (selectedObservation !== nextProps.selectedObservation) {
      if (selectedObservation && observations) {
        const observationExists = !!observations.find(
          o => o.id === selectedObservation.id
        );
        this.setState({ observationExists });
      }
    }
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.focusListener.remove();
  }

  keyboardWillShow = (e: any) => {
    Animated.timing(this.paddingInput, {
      duration: e.duration,
      toValue: 60
    }).start();
  };

  keyboardWillHide = (e: any) => {
    Animated.timing(this.paddingInput, {
      duration: e.duration,
      toValue: 0
    }).start();
  };

  keyboardDidShow = (e: any) => {
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
      this.props.navigation.navigate({
        routeName: 'CameraView',
        params: { showEditorView: true }
      });
    } else {
      this.setState(previousState => ({
        goToCamera: previousState.goToCamera,
        keyboardShown: false,
        text: previousState.text
      }));
    }
  };

  handleTextInputChange = (text: string) => {
    this.setState({ text });
  };

  isUpdateFlow = () => {
    const { selectedObservation, observations } = this.props;
    let updateFlow = false;
    if (selectedObservation) {
      observations.forEach(o => {
        if (o.id === selectedObservation.id) {
          updateFlow = true;
        }
      });
    }

    return updateFlow;
  };

  handleSaveObservation = () => {
    const {
      updateObservation,
      selectedObservation,
      observationSource,
      navigation,
      gps,
      showManualGPSModal,
      saveObservation,
      observations
    } = this.props;
    const { text, keyboardShown } = this.state;

    if (selectedObservation) {
      updateObservation({
        ...selectedObservation,
        notes: text
      });
    }

    const updateFlow = this.isUpdateFlow();

    if (gps.status !== HIGH_ACCURACY) {
      if (keyboardShown) {
        Keyboard.dismiss();
      }
      showManualGPSModal();
    } else {
      this.handleSave();
    }
  };

  handleTextInputBlur = () => {
    const { selectedObservation, updateObservation } = this.props;

    if (selectedObservation) {
      updateObservation({
        id: selectedObservation.id,
        notes: this.state.text
      });
    }
  };

  goToCameraView = () => {
    const { selectedObservation, updateObservation, navigation } = this.props;

    if (selectedObservation) {
      updateObservation({
        id: selectedObservation.id,
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
      navigation.navigate({
        routeName: 'CameraView',
        params: { showEditorView: true },
        key: 'camera-view'
      });
    }
    Keyboard.dismiss();
  };

  goToCategoriesView = () => {
    const { navigation, observations, selectedObservation } = this.props;
    let updateFlow = false;
    if (selectedObservation) {
      observations.forEach(o => {
        if (o.id === selectedObservation.id) {
          updateFlow = true;
        }
      });
    }

    if (updateFlow) {
      navigation.navigate({
        routeName: 'Categories',
        key: 'CategoriesView'
      });
    } else {
      navigation.goBack();
    }
  };

  goToObservationFields = () => {
    const { navigation } = this.props;

    navigation.navigate({
      routeName: 'ObservationFields'
    });
    Keyboard.dismiss();
  };

  handleModalCancel = () => {
    const {
      clearSelectedObservation,
      hideCancelModal,
      observationSource,
      updateObservation,
      navigation
    } = this.props;

    hideCancelModal();
    if (observationSource === 'map') {
      navigation.navigate({
        routeName: 'MapView'
      });
    } else {
      navigation.navigate({
        routeName: 'CameraView',
        params: { showEditorView: false }
      });
    }
    clearSelectedObservation();
  };

  handleModalContinue = () => {
    const { hideCancelModal } = this.props;

    hideCancelModal();
  };

  handleWaiting = () => {
    const { hideManualGPSModal } = this.props;

    hideManualGPSModal();
  };

  handleSave = () => {
    const { observationSource, navigation, saveObservation } = this.props;

    saveObservation(this.isUpdateFlow());
    if (observationSource === 'map') {
      navigation.navigate({
        routeName: 'MapView'
      });
    } else if (observationSource === 'detail') {
      navigation.navigate({ routeName: 'ObservationDetailView' });
    } else {
      navigation.navigate({
        routeName: 'CameraView',
        params: { showEditorView: false },
        key: 'camera-view'
      });
    }
  };

  allowEditing = (index: number) => {
    const { observationExists } = this.state;

    const allowEdit =
      !observationExists ||
      (observationExists && index >= this.state.numExistingPhotos);

    return allowEdit;
  };

  hasEdits = () => {
    const { selectedObservation } = this.props;
    const {
      numExistingPhotos,
      existingNotes,
      numExistingFieldsAnswered,
      text,
      observationExists
    } = this.state;

    if (selectedObservation) {
      if (observationExists) {
        const currentFieldsAnswered = selectedObservation.fields.filter(
          field => field.answered
        ).length;

        const hasEdits =
          selectedObservation.attachments.length !== numExistingPhotos ||
          text !== existingNotes ||
          currentFieldsAnswered !== numExistingFieldsAnswered;

        return hasEdits;
      }
      const hasFieldAnswered = !!selectedObservation.fields.find(
        field => field.answered
      );
      const noEdits =
        selectedObservation &&
        selectedObservation.attachments.length === 0 &&
        selectedObservation.notes === '' &&
        !hasFieldAnswered;

      return !noEdits;
    }

    return false;
  };

  handleCancel = () => {
    const { navigation, observationSource, showCancelModal } = this.props;
    if (this.hasEdits()) {
      showCancelModal();
    } else if (observationSource === 'map') {
      navigation.navigate({
        routeName: 'MapView'
      });
    } else if (observationSource === 'detail') {
      navigation.navigate({ routeName: 'ObservationDetailView' });
    }
  };

  render() {
    const {
      navigation,
      selectedObservation,
      showCancelModal,
      cancelModalVisible,
      showManualGPSModal,
      gpsFormat,
      category,
      icons
    } = this.props;
    const { keyboardShown, text } = this.state;
    const keyExtractor = (item, i) => i.toString();
    const goToManualEnter = () => {
      navigation.navigate({ routeName: 'ManualGPSView' });
    };
    let positionText = I18n.t('loading');
    if (selectedObservation) {
      positionText = getGPSText({
        gpsFormat,
        lat: selectedObservation.lat,
        lon: selectedObservation.lon
      });
    }
    let fieldAnswered;
    if (selectedObservation) {
      fieldAnswered = selectedObservation.fields.find(f => f.answered);
    }

    if (!selectedObservation) {
      return null;
    }

    return (
      <KeyboardAvoidingView style={styles.container}>
        <Header
          leftIcon={
            <TouchableOpacity
              underlayColor="rgba(0, 0, 0, 0.5)"
              onPress={this.handleCancel}
            >
              <CloseIcon color="#9E9C9C" name="window-close" size={30} />
            </TouchableOpacity>
          }
          rightIcon={
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
              {!!category &&
                !!category.icon &&
                !!icons[category.icon] && (
                  <Image
                    source={{
                      uri: `data:image/svg+xml;utf8,${icons[category.icon]}`
                    }}
                    style={{ height: 30, width: 30 }}
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
            autoFocus={!showManualGPSModal}
          />
        </ScrollView>
        {!!selectedObservation &&
          !!selectedObservation.attachments.length && (
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
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => {
                      if (this.allowEditing(index)) {
                        navigation.navigate({
                          routeName: 'PhotoView',
                          params: { photoId: item }
                        });
                      } else {
                        navigation.navigate({
                          routeName: 'PhotoView',
                          params: {
                            fromDetailView: true,
                            photoId: item
                          }
                        });
                      }
                    }}
                    style={{ paddingLeft: 10 }}
                  >
                    <Thumbnail attachmentId={item} />
                  </TouchableOpacity>
                )}
                data={selectedObservation.attachments}
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
        <CancelModal
          onContinue={this.handleModalContinue}
          onCancel={this.handleModalCancel}
          visible={cancelModalVisible}
        />
        <ManualGPSModal
          goToManualEnter={goToManualEnter}
          onWaiting={this.handleWaiting}
          onSave={this.handleSave}
        />
      </KeyboardAvoidingView>
    );
  }
}

export default ObservationEditor;
